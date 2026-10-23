window.__ModuleLoader__.load({
	id: "dsh-mobile-slim",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		/*
		 * Local corrections for the DSH mobile header and composer, layered on
		 * top of dsh-client-ui-mobile-adapt. Scoped to <=767px, upstream class
		 * names verified against dsh 0.2.0-rc.2.
		 *
		 * Measured at 390x844, before -> after:
		 *
		 *   header row   hamburger + title + "..." 44x44 + right-panel 44x44
		 *                -> hamburger + title only
		 *   tabs row     wSkVaW_tabs 366x44 (Chat / Trajectory / dsh-purge)
		 *                -> hidden
		 *   composer     wSkVaW_composerSeat 158px -> 132px
		 *                card 108 -> 90, row 52 -> 38, model trigger 44 -> 32,
		 *                stats pill 44 -> 28
		 *   content      wSkVaW_body 735px -> 768px of reading area
		 *
		 * Two specific traps this had to work around:
		 *
		 * 1. mobile-adapt raises every button in .wSkVaW_headerUtilities to
		 *    44x44, but the workspace split button's wrapper (.OMoRSG_split) is
		 *    a 24px-tall overflow:hidden box, so the 44px children were clipped
		 *    by 21px and the folder glyph lost its lower half. Solved here by
		 *    removing that block from the header entirely.
		 *
		 * 2. The composer row stayed 44px tall even after every button inside it
		 *    was shrunk to 36: the row carries padding 2px 6px 6px, and 36 + 8 =
		 *    44. The padding has to be stripped, not just the children.
		 */
		const css = `
@media (max-width: 767px) {
  /* ============ TOP: leave exactly one button (the hamburger) ============
   * .dsh-mobile-hamburger is a fixed overlay owned by mobile-adapt, so it
   * survives all of this. Everything else in the header goes: the "..." menu,
   * the right-panel toggle, the agent-preset icon, and the whole tabs row. */
  .wSkVaW_headerUtilities,
  .wSkVaW_headerCorner,
  .wSkVaW_headerActions,
  .wSkVaW_tabs {
    display: none !important;
  }

  .wSkVaW_titleRow {
    padding-right: 12px;
  }
  .wSkVaW_titleCluster {
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }
  .wSkVaW_crumbs {
    flex: 1 1 auto;
    min-width: 0;
  }
  .wSkVaW_crumb {
    max-width: none !important;
  }

  /* ============ BOTTOM: compact composer ============ */
  .wSkVaW_composerSeat {
    padding-bottom: 4px !important;
  }

  .uV2eYG_card {
    padding: 6px 8px 5px !important;
    border-radius: 14px !important;
  }
  .uV2eYG_scroll,
  .uV2eYG_grow,
  .uV2eYG_input {
    min-height: 26px !important;
  }
  .uV2eYG_placeholder {
    line-height: 1.35;
  }

  /* Strip the row's own padding (2px 6px 6px) or it stays 44px regardless of
   * how small its children get. */
  .uV2eYG_row {
    min-height: 36px !important;
    margin-top: 1px !important;
    gap: 4px !important;
    padding: 0 4px 2px !important;
  }
  .uV2eYG_tools,
  .uV2eYG_modes {
    height: 36px !important;
  }
  .uV2eYG_add,
  .iWlSmW_trigger,
  .uV2eYG_primary {
    width: 36px !important;
    min-width: 36px !important;
    height: 36px !important;
    min-height: 36px !important;
  }
  .uV2eYG_trailing,
  .uV2eYG_standardControls {
    height: 36px !important;
  }

  /* The wrappers around those buttons were also 44px: dshp-rewind-wrap 58x44,
   * _7KE1Ra_root 112x44, and the _root_4ub78_1 span around the permission
   * trigger. Collapse them too. */
  .dshp-rewind-wrap,
  ._7KE1Ra_root,
  .uV2eYG_row > span,
  .uV2eYG_standardControls > *,
  .uV2eYG_trailing > * {
    height: 36px !important;
    min-height: 36px !important;
  }

  /* The Undo chip (dsh-purge) and the model selector set the row's width
   * pressure; trim both. */
  .dshp-rewind {
    height: 30px !important;
    min-height: 30px !important;
    padding: 0 8px !important;
    font-size: 12px !important;
  }
  ._7KE1Ra_trigger {
    height: 32px !important;
    min-height: 32px !important;
    max-width: 104px !important;
  }
  ._7KE1Ra_triggerLabel {
    font-size: 11.5px !important;
  }

  /* Stats dock under the composer. */
  .uV2eYG_dock {
    margin-top: 2px !important;
    height: 30px !important;
  }
  .dsh-stats-pill {
    height: 28px !important;
    min-height: 28px !important;
    padding: 0 10px !important;
  }
  .dsh-stats-pill-text {
    font-size: 11px !important;
  }
  .JObwrW_trigger {
    height: 28px !important;
    min-height: 28px !important;
    font-size: 11px !important;
  }

  /* ==================================================================
   * 2026-10-23 改版：顶栏只留汉堡、底栏收窄 + 半透明 + 交互收放
   * 说明：以下规则写在原规则之后，同特异性下后者胜，用于覆盖上面的尺寸。
   * ================================================================== */

  /* ---- 顶部：删掉标题与所有右侧按钮，只保留汉堡 ----
   * header 从 76px 压到 54px：汉堡是 fixed(top:10px, 44x44)，底边正好 54，
   * 因此内容区从 54px 开始，既不被遮挡也不留白。 */
  .wSkVaW_titleRow,
  .wSkVaW_titleCluster,
  .wSkVaW_crumbs,
  .wSkVaW_crumb {
    display: none !important;
  }
  .wSkVaW_header {
    height: 0 !important;
    min-height: 0 !important;
    max-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    box-shadow: none !important;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }
  /* 顶部留白必须加在真正滚动的那层（.wSkVaW_scrollBody），不能加在外层
   * .wSkVaW_body 上：后者 overflow:visible、高度等于整屏，压根不滚动，
   * padding 只会变成一条永久白带，把正文整体压下去——2026-10-23 用户手机
   * 实拍就是这个症状（白条盖住正文顶部）。加在滚动容器内部，留白会随内容
   * 一起滚出视口，正文随后即可从汉堡下方通过。 */
  .wSkVaW_body {
    padding-top: 0 !important;
  }
  .wSkVaW_scrollBody {
    padding-top: 56px !important;
  }
  /* 汉堡改成半透明毛玻璃，正文从它背后滑过时不会显得突兀 */
  .dsh-mobile-hamburger {
    background-color: color-mix(in srgb, Canvas 78%, transparent) !important;
    -webkit-backdrop-filter: blur(12px) saturate(1.3);
    backdrop-filter: blur(12px) saturate(1.3);
  }

  /* ---- 代码块标题栏：取消吸顶 ----
   * 它的外层是 position:sticky; top:0; z-index:6。滚动容器
   * (.wSkVaW_scrollBody) 带 padding-top:56px，sticky 的粘附位置因此错位
   * （实测停在 y≈32 而非对齐顶部），于是标题栏悬在代码内容之上，把正在
   * 滚动的第一行代码盖住，语言标签"css/powershell"也紧贴汉堡右边。
   * 手机屏窄，吸顶收益不抵遮挡，直接退回普通流。 */
  [class*="_bannerWrap"] {
    position: static !important;
    top: auto !important;
  }

  /* ---- 底部：默认收窄 + 半透明 ----
   * Canvas 是系统色关键字，light 下等于白、dark 下等于深色，比写死 #fff
   * 更安全。uV2eYG_hero 是首页的空会话大输入框，不参与收窄。 */
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_card {
    padding: 3px 8px 2px !important;
    border-radius: 16px !important;
    background-color: color-mix(in srgb, Canvas 82%, transparent) !important;
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    backdrop-filter: blur(16px) saturate(1.4);
    transition: padding 0.16s ease, background-color 0.16s ease;
  }
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_scroll,
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_grow,
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_input {
    min-height: 20px !important;
  }
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_row {
    min-height: 28px !important;
    margin-top: 0 !important;
    gap: 3px !important;
    padding: 0 3px 1px !important;
  }
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_tools,
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_modes,
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_trailing,
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_standardControls {
    height: 28px !important;
  }
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_add,
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_primary,
  .uV2eYG_root:not(.uV2eYG_hero) .iWlSmW_trigger,
  .uV2eYG_root:not(.uV2eYG_hero) ._7KE1Ra_trigger {
    width: 28px !important;
    min-width: 28px !important;
    height: 28px !important;
    min-height: 28px !important;
  }
  /* 统计条默认收起，点开才算 */
  .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_dock {
    display: none !important;
  }
  .wSkVaW_composerSeat {
    padding-bottom: 2px !important;
  }

  /* ---- 底部：点击 → 展开更多信息 ----
   * 这里不能用 :focus-within：dsh 进入会话时会自动 focus 输入框，导致
   * focusWithIn 恒为真、"默认收窄"永远压不住。改用 html 上的
   * .dsh-composer-open，由用户真实点击驱动（class 挂在 <html> 上，
   * 不会被 React 重渲染抹掉）。 */
  .dsh-composer-open .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_card {
    padding: 6px 8px 5px !important;
    background-color: Canvas !important;
  }
  .dsh-composer-open .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_row {
    min-height: 36px !important;
    padding: 0 4px 2px !important;
  }
  .dsh-composer-open .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_scroll,
  .dsh-composer-open .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_grow,
  .dsh-composer-open .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_input {
    min-height: 26px !important;
  }
  .dsh-composer-open .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_dock {
    display: flex !important;
  }

  /* ---- 底部：页面滑动时重新收窄（写在 focus-within 之后，同特异性胜出） ---- */
  .dsh-scrolling .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_card {
    padding: 3px 8px 2px !important;
    background-color: color-mix(in srgb, Canvas 82%, transparent) !important;
  }
  .dsh-scrolling .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_row {
    min-height: 28px !important;
    padding: 0 3px 1px !important;
  }
  .dsh-scrolling .uV2eYG_root:not(.uV2eYG_hero) .uV2eYG_dock {
    display: none !important;
  }
}
`;

		/* ⚠ 不要把下面这段改回 head + MutationObserver。
		 *
		 * 注入到 <body> 而不是 <head>：文档顺序上，body 内的样式表永远排在
		 * head 内所有样式表之后，因此同特异性同 importance 时必胜——不需要、
		 * 也不应该去和别的插件"抢 head 末尾"。
		 *
		 * 旧实现（observe(document.head) + appendChild 保末尾）会与
		 * dsh-client-ui-mobile-adapt 的 styleGuard 形成无限乒乓：它要求自己在
		 * head 末尾，本插件一把它挤开它就搬回去，本插件再搬……每轮都产生新的
		 * childList mutation，进而把 @deepseek-ai/dsh-client-shortcuts 的全文档
		 * MutationObserver 拖进风暴，boot 阶段主线程被吃死，页面停在
		 * "HARNESS / Loading plugins…" 并弹出 Page Unresponsive。
		 *
		 * 2026-10-23 实测四组对照：都不开 3050ms/329 元素、只开 fixups
		 * 3042ms/405、只开 mobile-adapt 3080ms/286，全部正常；两个都开
		 * >126s 且 DOM 只有 9 个元素。改为 body 注入后 3069ms/370 元素。
		 *
		 * 若把此段改回 head 版本，卡死会立刻复发。 */
		const tagId = "dsh-mobile-slim/client.css";
		let tag = null;
		const ensureLast = () => {
			if (typeof document === "undefined") return;
			const host = document.body;
			if (host === null) return;
			if (tag === null) {
				tag = document.createElement("style");
				tag.dataset.plugin = "dsh-mobile-slim";
				tag.dataset.pluginCss = tagId;
				tag.textContent = css;
			}
			if (tag.parentNode !== host) host.appendChild(tag);
		};

		ensureLast();
		if (typeof document !== "undefined" && typeof window !== "undefined") {
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", ensureLast, { once: true });
			}
			/* 只做一次性校正，不再挂 MutationObserver。 */
			window.addEventListener("load", ensureLast, { once: true });
		}

		/* ── 用户滑动页面时把底栏重新收窄 ───────────────────────────────
		 * 监听 touchmove / wheel 而不是 scroll：scroll 会被程序自身触发
		 * （自动滚到底、虚拟列表校正），导致页面一加载就永远处于"滑动中"，
		 * 把 :focus-within 的展开态一直压住。touchmove/wheel 只在人真的
		 * 动手指或滚轮时发出。不改 DOM 结构，也不引入 MutationObserver。 */
		let scrollTimer = null;
		const markScrolling = () => {
			if (typeof document === "undefined") return;
			const root = document.documentElement;
			root.classList.add("dsh-scrolling");
			if (scrollTimer !== null) window.clearTimeout(scrollTimer);
			scrollTimer = window.setTimeout(() => {
				root.classList.remove("dsh-scrolling");
				scrollTimer = null;
			}, 480);
		};
		if (typeof window !== "undefined") {
			window.addEventListener("touchmove", markScrolling, { passive: true, capture: true });
			window.addEventListener("wheel", markScrolling, { passive: true, capture: true });
		}

		/* ── 点击底栏 → 展开；点别处 → 收回 ─────────────────────────────
		 * 用 html 上的 class 而不是 composer 自己的 class：React 重渲染
		 * 会重设 className，挂在 <html> 上才稳。 */
		const COMPOSER_SEL = '[class*="uV2eYG_root"]';
		const openComposer = () => {
			if (typeof document === "undefined") return;
			document.documentElement.classList.add("dsh-composer-open");
		};
		const closeComposerSoon = () => {
			if (typeof window === "undefined") return;
			/* 不等 activeElement 判断：移动端点正文不一定让 input 失焦，
			 * 那会让底栏永远收不回去。点到底栏以外就收起。 */
			window.setTimeout(() => {
				document.documentElement.classList.remove("dsh-composer-open");
			}, 120);
		};
		if (typeof document !== "undefined") {
			document.addEventListener("pointerdown", (event) => {
				const target = event.target;
				if (target instanceof Element && target.closest(COMPOSER_SEL) !== null) openComposer();
				else closeComposerSoon();
			}, true);
			/* 键盘弹出/收起后布局会跳一次，顺手校正 */
			if (typeof window !== "undefined") {
				window.addEventListener("resize", () => {
					const root = document.querySelector(COMPOSER_SEL);
					if (root !== null && root.contains(document.activeElement)) openComposer();
				}, { passive: true });
			}
		}

		function apply() {
			ensureLast();
		}
		exports.apply = apply;
		exports.inject = [];
		return module.exports;
	}
});

