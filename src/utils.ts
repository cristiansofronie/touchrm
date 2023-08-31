import { Block } from './types';

export const scrollIntoViewIfNeeded = function (
  elem: HTMLElement,
  centerIfNeeded?: boolean,
) {
  centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

  let parent = elem.parentElement,
    parentComputedStyle = window.getComputedStyle(parent, null),
    parentBorderTopWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-top-width'),
    ),
    parentBorderLeftWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-left-width'),
    ),
    overTop = elem.offsetTop - parent.offsetTop < parent.scrollTop,
    overBottom =
      elem.offsetTop -
        parent.offsetTop +
        elem.clientHeight -
        parentBorderTopWidth >
      parent.scrollTop + parent.clientHeight,
    overLeft = elem.offsetLeft - parent.offsetLeft < parent.scrollLeft,
    overRight =
      elem.offsetLeft -
        parent.offsetLeft +
        elem.clientWidth -
        parentBorderLeftWidth >
      parent.scrollLeft + parent.clientWidth,
    alignWithTop = overTop && !overBottom;

  if ((overTop || overBottom) && centerIfNeeded) {
    parent.scrollTop =
      elem.offsetTop -
      parent.offsetTop -
      parent.clientHeight / 2 -
      parentBorderTopWidth +
      elem.clientHeight / 2;
  }

  if ((overLeft || overRight) && centerIfNeeded) {
    parent.scrollLeft =
      elem.offsetLeft -
      parent.offsetLeft -
      parent.clientWidth / 2 -
      parentBorderLeftWidth +
      elem.clientWidth / 2;
  }

  if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
    elem.scrollIntoView(alignWithTop);
  }
};

interface SearchEntry {
  str: string;
}

export const search = (
  entries: SearchEntry[],
  callback: (entry: SearchEntry) => void,
) => {
  const hostElem = document.createElement('div');
  hostElem.id = 'host-elem';

  const hStyle = hostElem.style;
  hStyle.backgroundColor = 'white';
  hStyle.padding = '50px 30px';
  hStyle.position = 'fixed';
  hStyle.top = '2vh';
  hStyle.left = '2vw';
  hStyle.width = '96vw';
  hStyle.height = '96vh';
  hStyle.zIndex = '9999';
  hStyle.borderRadius = '10px';

  const style = document.createElement('style');
  style.textContent = `
    .focused {
      background-color: beige;

    }
    #entries-host-elem div {
      border-radius: 5px;
      padding: 3px;
    }
    #entries-host-elem div:hover {
      background-color: rgba(245,245,220, 0.5);
    }
    #exit-button:hover {
      background-color: rgba(245,245,220, 0.5);
      border-radius: 3px;
    }
  `;
  hostElem.prepend(style);

  const exit = document.createElement('span');
  exit.textContent = 'Close';
  exit.id = 'exit-button';
  exit.onclick = () => hostElem.remove();
  exit.style.position = 'absolute';
  exit.style.left = '20px';
  exit.style.top = '10px';
  exit.role = 'button';
  hostElem.append(exit);

  const noEntries = document.createElement('span');
  noEntries.textContent = entries.length + ' items';
  noEntries.id = 'no-entries-button';
  noEntries.style.position = 'absolute';
  noEntries.style.right = '20px';
  noEntries.style.top = '10px';
  hostElem.append(noEntries);

  const input = document.createElement('input');
  input.style.display = 'block';
  input.style.width = '100%';
  input.tabIndex = 0;
  hostElem.prepend(input);

  const entriesHostElem = document.createElement('div');
  entriesHostElem.id = 'entries-host-elem';
  entriesHostElem.style.padding = '20px';
  entriesHostElem.style.height = '85vh';
  entriesHostElem.style.overflow = 'scroll';
  hostElem.append(entriesHostElem);

  input.oninput = () => {
    entriesHostElem.querySelectorAll('div').forEach(e => e.remove());
    entries.slice(0, 50).forEach((e, i) => {
      if (
        input.value
          .toLowerCase()
          .split(' ')
          .every(str => e.str.toLowerCase().includes(str))
      ) {
        const div = document.createElement('div');
        div.textContent = e.str;
        div.setAttribute('data-index', String(i));
        entriesHostElem.prepend(div);
      }
    });
    entriesHostElem.getElementsByTagName('div')[0].classList.add('focused');
  };

  hostElem.onkeydown = e => {
    if (e.key === 'Escape') {
      hostElem.remove();
    } else if (e.key === 'Home') {
      e.preventDefault();
      let focused = entriesHostElem.getElementsByClassName(
        'focused',
      )[0] as HTMLElement;
      focused.classList.remove('focused');

      focused = entriesHostElem.getElementsByTagName('div')[0];
      if (focused) {
        focused.classList.add('focused');
        scrollIntoViewIfNeeded(focused);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      let focused = entriesHostElem.getElementsByClassName(
        'focused',
      )[0] as HTMLElement;
      focused.classList.remove('focused');

      focused = [...entriesHostElem.getElementsByTagName('div')].at(-1);

      if (focused) {
        focused.classList.add('focused');
        scrollIntoViewIfNeeded(focused);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let focused = entriesHostElem.getElementsByClassName(
        'focused',
      )[0] as HTMLElement;
      focused.classList.remove('focused');

      if (focused.nextElementSibling) {
        focused = focused.nextElementSibling as HTMLElement;
        focused.classList.add('focused');
      } else {
        focused = entriesHostElem.getElementsByTagName('div')[0];
        focused.classList.add('focused');
      }
      scrollIntoViewIfNeeded(focused);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let focused = entriesHostElem.getElementsByClassName(
        'focused',
      )[0] as HTMLElement;

      focused.classList.remove('focused');

      if (focused.previousElementSibling) {
        focused = focused.previousElementSibling as HTMLElement;
        focused.classList.add('focused');
      } else {
        focused = [...entriesHostElem.getElementsByTagName('div')].at(-1);
        focused.classList.add('focused');
      }
      scrollIntoViewIfNeeded(focused);
    } else if (e.key === 'Enter') {
      const focused = entriesHostElem.getElementsByClassName(
        'focused',
      )[0] as HTMLElement;
      if (focused) {
        if (focused.dataset?.index)
          callback(entries[parseInt(focused.dataset.index)]);
        hostElem.remove();
      }
    }
  };

  entries.slice(0, 50).forEach((e: SearchEntry, i: number) => {
    const div = document.createElement('div');
    div.textContent = e.str;
    div.setAttribute('data-index', String(i));
    entriesHostElem.prepend(div);
  });

  entriesHostElem.getElementsByTagName('div')[0].classList.add('focused');

  document.body.prepend(hostElem);
  input.focus();
};

export const focusViewTabWindow = () => {
  const msg = {
    actionType: 'focusTag',
    data: {
      tag: 'd',
    },
  };
  window.ws.send(JSON.stringify(msg));
};

const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
export const mouseClick = (elem: HTMLElement) => {
  mouseClickEvents.forEach(mouseEventType =>
    elem.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      }),
    ),
  );
};

export const UIGuard = async (
  func: () => Promise<void>,
  styleContent: string,
) => {
  const style = document.createElement('style');
  style.textContent = styleContent;
  document.body.prepend(style);

  const working = document.createElement('div');
  working.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: yellow;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    z-index: 999999;
  `;
  document.body.append(working);

  const block = document.createElement('div');
  block.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    background-color: transparent;
    width: 100vw;
    height: 100vh;
    z-index: 9999999999999;
    tab-index: 1;
  `;
  document.body.append(block);
  block.focus();

  const blockKeyboard = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();
    e.preventDefault();
  };
  const events = ['keydown', 'keyup', 'keypress'];

  events.forEach(event => {
    window.addEventListener(event, blockKeyboard, true);
  });

  await func();

  style.remove();
  events.forEach(event => {
    window.removeEventListener(event, blockKeyboard, true);
  });
  block.remove();
  working.remove();
};

export const titleMatchRegEx = (regex: string) => {
  return window.roamAlphaAPI.q(
    `[
    :find ?t ?u
    :in $ ?regex
    :where
      [?n :node/title ?t]
      [?n :block/uid ?u]
      [(re-pattern ?regex) ?r]
      [(re-find ?r ?t)]
  ]`,
    regex,
  );
};

export const blkStr = (uid: string) => {
  return window.roamAlphaAPI.q(
    `[
    :find ?str .
    :in $ ?uid
    :where
      [?blk :block/uid ?uid]
      [?blk :block/string ?str]
  ]`,
    uid,
  ) as unknown as string | null;
};

export const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(resolve, time));

export const createBlocks = (blocks: Block[], uid: string) => {
  blocks.forEach((blk: Block) => {
    const newUID = window.roamAlphaAPI.util.generateUID();
    window.roamAlphaAPI.createBlock({
      location: {
        'parent-uid': uid,
        order: 'last',
      },
      block: {
        uid: newUID,
        string: blk.string,
      },
    });
    if (blk.blocks) {
      createBlocks(blk.blocks, newUID);
    }
  });
};
