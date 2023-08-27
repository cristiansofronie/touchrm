import type {
  Target,
  HintsTargetElem,
  HintsCallback,
  HintsOpts,
} from './types';

interface HintsHTMLElement extends HTMLElement {
  zIndex?: string;
}

let prevHints: {
  target: Target;
  callback: HintsCallback;
  opts: HintsOpts;
  elem: HintsTargetElem;
} | null;

const hintKeys = "asdfgqwertzxcvbhjkl;'yuiop[]nm,./-=";

const genLabels = (total: number): string[] => {
  let ch, hints, i, len, offset;
  hints = [''];
  offset = 0;
  while (hints.length - offset < total || hints.length === 1) {
    const hint = hints[offset++];
    for (i = 0, len = hintKeys.length; i < len; i++) {
      ch = hintKeys[i];
      hints.push(ch + hint);
    }
  }
  hints = hints.slice(offset, offset + total);
  return hints.map(str => {
    return str.split('').reverse().join('').toLowerCase();
  });
};

const getZIndex = (node: HTMLElement) => {
  let z = 0;
  do {
    let i = parseInt(getComputedStyle(node).getPropertyValue('z-index'));
    z += isNaN(i) || i < 0 ? 0 : i;
    node = node.parentElement;
  } while (
    node &&
    node !== document.body &&
    node.nodeType !== node.DOCUMENT_FRAGMENT_NODE
  );
  return z;
};

const flip = (holder: HintsHTMLElement) => {
  const hints = holder.querySelectorAll('div') as NodeListOf<HintsHTMLElement>;
  if (hints[0].style.zIndex == hints[0].zIndex) {
    hints.forEach((hint, i) => {
      const z = parseInt(hint.style.zIndex);
      hint.style.zIndex = String(hints.length - i + 2147483000 - z);
    });
  } else {
    hints.forEach(hint => {
      hint.style.zIndex = hint.zIndex;
    });
  }
};

export const createHints = async (
  target: Target,
  callback: HintsCallback,
  opts?: HintsOpts,
) => {
  if (!opts) {
    opts = {};
  }

  let elems: HintsTargetElem[];

  if (typeof target === 'string') {
    elems = [...document.querySelectorAll(target)] as HintsTargetElem[];
  } else if (typeof target === 'function') {
    elems = target();
  } else {
    elems = target;
  }

  const visibleElems = elems.filter((elem: Element) => {
    const box = elem.getBoundingClientRect();
    // Check if at least one of the border points is visible on screen or the
    // center

    // const topElem = document.elementFromPoint(x,y);
    // const topElemHalf = document.elementFromPoint(x + box.width / 2 ,y + box.height / 2);

    // For something to be visible at least one of its corners should should
    // be positive and less than the window height or width respectively. If
    // opposing ends are invisible then the element is bigger than the screen
    // and a hint should still be displayed.

    const inViewport =
      (['top', 'bottom'].some((e: 'top' | 'bottom') => {
        return box[e] > 0 && box[e] < window.innerHeight;
      }) &&
        ['left', 'right'].some((e: 'left' | 'right') => {
          return box[e] > 0 && box[e] < window.innerWidth;
        })) ||
      (box.top < 0 && box.bottom > window.innerHeight) ||
      (box.left < 0 && box.right > window.innerWidth);

    if (opts.alsoVisible) {
      const visible = ['top', 'bottom'].some((vert: 'top' | 'bottom') =>
        ['left', 'right'].some(
          (horiz: 'left' | 'right') =>
            document.elementFromPoint(box[horiz], box[vert]) === elem,
        ),
      );
      return inViewport && visible;
    }

    return inViewport;
  });

  if (visibleElems.length === 1 && opts.autoAction) {
    prevHints = {
      target,
      callback,
      opts,
      elem: visibleElems[0],
    };
    for (let i = 0; i < window.hintsCount; i++) {
      await callback(visibleElems[0]);
    }
    return;
  }

  const hintsWrapper = document.createElement('div');
  hintsWrapper.className = 'touchrm-hints-wrapper';
  hintsWrapper.attachShadow({ mode: 'open' });

  const hintsStyle = document.createElement('style');
  hintsStyle.textContent = `
    .hint-shortcut {
      text-decoration: underline;
    }
    section div {
      position: fixed;
      z-index: 999;
      background-color: rgb(221, 228, 237);
      color: black;
      border-radius: 5px;
      border: 1px solid black;
      padding: 2px;
      font-weight: bold;
    }
  `;
  hintsWrapper.shadowRoot.appendChild(hintsStyle);

  document.documentElement.appendChild(hintsWrapper);

  const holder = document.createElement('section');
  holder.innerHTML = '';

  let hints = genLabels(visibleElems.length);
  let elemHintMap: [string, HintsTargetElem][] = [];

  visibleElems.forEach((elem, i) => {
    const hint: HintsHTMLElement = document.createElement('div');

    if (elem?.data) {
      hint.innerHTML =
        '<span class="hint-shortcut">' + hints[i] + '</span><br>' + elem.data;
    } else {
      hint.textContent = hints[i];
    }

    elemHintMap.push([hints[i], elem]);

    const rect = elem.getBoundingClientRect();
    // if just some part of it is visible still show a hint lower
    hint.style.left = (rect.x >= 0 ? rect.x : 0) + 'px';
    hint.style.top = (rect.y >= 0 ? rect.y : 0) + 'px';
    const z = getZIndex(hint);
    hint.style.zIndex = String(z + 9999);
    hint.zIndex = hint.style.zIndex;

    holder.appendChild(hint);
  });

  hintsWrapper.shadowRoot.appendChild(holder);

  let hintIndex = 0;
  async function selectHint(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (event.key === 'Escape') {
      hintsWrapper.remove();
      document.removeEventListener('keydown', selectHint, true);
    } else if (event.key === 'Shift') {
      flip(holder);
    } else if (hintKeys.includes(event.key)) {
      elemHintMap = elemHintMap.filter(e => e[0][hintIndex] === event.key);
      hintIndex++;

      if (elemHintMap.length === 1) {
        hintsWrapper.remove();
        document.removeEventListener('keydown', selectHint, true);
        prevHints = {
          target,
          callback,
          opts,
          elem: elemHintMap[0][1],
        };
        for (let i = 0; i < window.hintsCount; i++) {
          await callback(elemHintMap[0][1]);
        }

        if (opts.multiHits) {
          createHints(target, callback, opts);
        }
      }
    } else {
      hintsWrapper.remove();
      document.removeEventListener('keydown', selectHint, true);
    }
  }

  document.addEventListener('keydown', selectHint, true);
};

export const callPrevHints = () => {
  createHints(
    prevHints.target,
    prevHints.callback,
    prevHints.opts
  );
  return false;
};
