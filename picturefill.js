// From fork at https://github.com/nelsonmenezes/picturefill

/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with divs). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function(w) {

	// Enable strict mode
	"use strict";

	var PICTUREFILL_FLAG = "data-picturefilled",
		docEl = w.document.documentElement,
		applyingToWholeDoc = false;

	var applyImage = function(el) {

		var sources = el.getElementsByTagName("div"),
			matches = [],
			source,
			media,
			picImg;

		// See if/which sources match

		for (var i = 0, len = sources.length; i < len; ++i) {

			source = sources[i];
			media = source.getAttribute("data-media");

			// if there's no media specified, OR w.matchMedia is supported

			if (!media || (w.matchMedia && w.matchMedia(media).matches)) {

				matches.push(source);
			}
		}

		// Find any existing img element in the picture element

		picImg = el.getElementsByTagName("img")[0];

		if (matches.length) {

			if (!picImg) {

				picImg = w.document.createElement("img");
				picImg.alt = el.getAttribute("data-alt");
				el.appendChild(picImg);
			}

			picImg.src = matches.pop().getAttribute("data-src");
		}
		else if (picImg) {

			el.removeChild(picImg);
		}
	};

	var picturefill = function(rootEl) {

		var clientWidth = docEl.clientWidth,
			pics = [],
			all,
			el;

		if (applyingToWholeDoc) {

			// TODO: "applyingToWholeDoc" exists because several elements/pages
			//       take a heavy-handed approach by calling picturefil on
			//       the whole document. This can slow down page load. Ideally,
			//       those modules should call picturefil on only the
			//       relevant DOM elements. The image element accounts for most
			//       of this, so most other elements would not need to have
			//       their own calls to picturefil;

			return;
		}

		if (!rootEl) {

			applyingToWholeDoc = true;
			rootEl = docEl;
		}

		all = rootEl.getElementsByTagName("div");


		for (var i = 0, len = all.length; i < len; ++i) {

			el = all[i];
			if (el.hasAttribute("data-picture") && !el.hasAttribute(PICTUREFILL_FLAG)) {

				pics.push(el);
			}
		}

		all = null;  // For GC

		// Loop the pictures
		for (var i = 0, len = pics.length; i < len; ++i) {

			el = pics[i];
			el.setAttribute(PICTUREFILL_FLAG, "");

			// Apply the correct image
			applyImage(el);

			// Attach an event to resize for switching images
			// Must use a closure for keeping references

			(function () {

				var eventedEl = el,
					prevWidth = clientWidth;

				var resizeHandler = function() {

					if (!docEl.contains(eventedEl)) {

						// Element no longer in DOM; remove event handler

						if (w.removeEventListener) {

							w.removeEventListener("resize", resizeHandler)
						}
						else {

							w.removeEvent("onresize", resizeHandler)
						}

						return;
					}

					if (docEl.clientWidth != prevWidth) {

						// Mobile browsers trigger onresize too often (e.g. on scroll)
						// Ensure that we actually need to reevaluate image

						prevWidth = docEl.clientWidth;
						applyImage(eventedEl);
					}
				};

				if (w.addEventListener) {

					w.addEventListener("resize", resizeHandler)
				}
				else {

					w.attachEvent("onresize", resizeHandler)
				}
			}());
		}

		if (applyingToWholeDoc) {

			w.setTimeout(function() { applyingToWholeDoc = false; }, 0);
		}
	};

	if (typeof define === "function" && define.amd) {

		define([], function () { return picturefill; });
	}
	else {

		w.picturefill = picturefill;
	}

}(this));
