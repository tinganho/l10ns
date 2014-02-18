# TransitionEnd
TransitionEnd is a agnostic lib cross-browser to work with event transitionend.

## Methods
* transitionEnd(element).<code>bind(callback)</code>
* transitionEnd(element).<code>unbind()</code>
* transitionEnd(element).<code>whichTransitionEnd()</code>

**Examples**
```js
var box = $("#box"); // or document.getElementById("box")
var foo = $("#foo");

transitionEnd(box).bind(function(){
	$("#foo").addClass("on");
	transitionEnd(box).unbind();
});

var transition = transitionEnd(box).whichTransitionEnd(); // return for example "webkitTransitionEnd"
```
