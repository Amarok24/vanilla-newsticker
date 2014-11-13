/*  Vanilla-NewsTicker v1.0

    vanilla JavaScript (no dependencies)
    Jan Pražák, 11/2014
    https://github.com/Amarok24
    License: GNU GPLv3, https://gnu.org/licenses/gpl-3.0.txt

    Features:
    - auto stop on mouse over
    - auto stop on window unfocus
    - can scroll most tags (even images), not just UL/LI
    - adjustable height of wrapper, height of each element,
      delay & tick-rate & interval that fires the main tick-function (all in milliseconds)
*/


function getStyle(s_elementId, s_styleProp)
{
    var element = s_elementId;
    var returnValue;

    if (window.getComputedStyle) /* Mozilla... */
        returnValue = window.getComputedStyle(element, null).getPropertyValue(s_styleProp);
    else if (element.currentStyle) /* IE < 9 */
        returnValue = element.currentStyle[s_styleProp];
    return returnValue;
}

function setStyle(s_elementId, s_styleName, s_styleProp)
{   /* styleNames are CSS2Properties:  backgroundColor, fontSize, imageOrientation ... */
    s_elementId.style[s_styleName] = s_styleProp;
}


function newsTickerAnim(el, start_topposition_i, const_limit_1, const_limit_2, tickrate_ms, interval_ms)
{
    var topposition_i = start_topposition_i,
        temp_pos = 0,
        mouseInside = false,
        pageFocus = true;

    function tick()
    {
        if (mouseInside || !pageFocus) return;
        topposition_i--;
        temp_pos--;
        el.style.top = topposition_i + "px";

        if (temp_pos > -const_limit_1) {
          setTimeout(tick, tickrate_ms);
        } else if (topposition_i > -const_limit_2) {
            temp_pos = 0;
        } else {
            el.style.top = topposition_i + "px";
            topposition_i = start_topposition_i;
            temp_pos = 0;
        }
    }

    function mouseEvent(going_inside)
    {
        if (!mouseInside && going_inside) { mouseInside = true }
        else { mouseInside = false }
    }

    function pageShowing(state)
    {
        if (state) { pageFocus = true; console.log("newsTicker page focus") }
        else { pageFocus = false; console.log("newsTicker page unfocus") }
    }

    el.style.top = topposition_i + "px";
    setStyle(el, "visibility", "visible");
    window.setInterval( tick, interval_ms );
    // first short animation probably finished here, recursion takes place only inside of "tick()"
    el.addEventListener("mouseenter", function() { mouseEvent(true) });
    el.addEventListener("mouseleave", function() { mouseEvent(false) });
    window.addEventListener("focus", function() { pageShowing(true) });
    window.addEventListener("blur", function() { pageShowing(false) });
}

function vanillaNewsTicker(el, tickerHeight, itemHeight, startdelay_ms, tickrate_ms, interval_ms)
{
    var tickerHeight = tickerHeight || 180,
        itemHeight = itemHeight || 60,
        startdelay_ms = startdelay_ms || 250,
        tickrate_ms = tickrate_ms || 16,
        interval_ms = interval_ms || 2000,
        tickerHeight_complete = 0,
        i;

    setStyle(el, "height", tickerHeight + "px");
    setStyle(el, "overflow", "hidden");
    el = el.children[0];
    setStyle(el, "position", "relative");
    setStyle(el, "visibility", "hidden");

    for (i = 0; i < el.childElementCount; i++) {
        el.children[i].style.height = itemHeight + "px";
    }

    tickerHeight_complete = getStyle(el, "height"); // eg. "300px"
    tickerHeight_complete = +tickerHeight_complete.slice(0, -2); // delete last 2 chars & type int
    console.log("Complete height of newsticker = " + tickerHeight_complete);
    setTimeout(function() {
                    newsTickerAnim(el, tickerHeight, itemHeight, tickerHeight_complete, tickrate_ms, interval_ms)
                } , startdelay_ms);
}
