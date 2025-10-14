// ==UserScript==
// @name         翻页时滚动 Bilibili 评论区到回复起始位置
// @namespace    myitian.bili.replyAutoScrollToTop
// @version      0.1
// @description  翻页时滚动 Bilibili 评论区到回复起始位置，方便看楼中楼
// @author       Myitian
// @license      MIT
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

window.addEventListener('click', jump, true);

/**
 * @param {Event?} event
 * @param {HTMLElement?} element
 */
function jump(event, element = undefined) {
    /** @type {HTMLElement} */
    var e = element ?? event.target;
    if (e.shadowRoot) {
        jump(null, e.shadowRoot.activeElement);
        e.shadowRoot.addEventListener('click', jump, true);
    }
    if (!(e.classList.contains("view-more-btn")
        || e.classList.contains("pagination-btn")
        || e.classList.contains("pagination-page-number")
        || (!e.parentElement && e.parentNode?.host?.parentNode?.querySelector("bili-text-button")))) {
        return;
    }
    while (true) {
        if (e.querySelector("bili-comment-renderer")) {
            e = e.querySelector("bili-comment-renderer").shadowRoot?.querySelector("bili-comment-action-buttons-renderer")?.shadowRoot;
            break;
        } else if (e.host && !e.classList) {
            e = e.host;
        } else if (e.classList.contains("reply-item")) {
            break;
        } else if (e.parentElement) {
            e = e.parentElement;
        } else if (e.parentNode) {
            e = e.parentNode;
        } else {
            return;
        }
    }
    if (!e) {
        return;
    }
    /** @type {HTMLDivElement?} */
    var reply_info = e.host ? e : e.querySelector(".reply-info");
    if (reply_info) {
        /** @type {HTMLDivElement?} */
        var scroll_anchor = reply_info.querySelector(".myt-scroll-anchor");
        if (!scroll_anchor) {
            scroll_anchor = document.createElement("div");
            scroll_anchor.className = "myt-scroll-anchor";
            scroll_anchor.style.position = "relative";
            scroll_anchor.style.top = "-5em";
            reply_info.appendChild(scroll_anchor);
        }
        scroll_anchor.scrollIntoView();
    }
}