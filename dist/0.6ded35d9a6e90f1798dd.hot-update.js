webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function($) {'use strict';\n\n__webpack_require__(3);\n__webpack_require__(7);\n__webpack_require__(8);\nfor (var i = 1; i < 69; i++) {\n\t__webpack_require__(10)(\"./\" + i + '.gif');\n}\nvar COLOR = '';\n/*调整页面 */\n$('.login').remove();\n//var socket = require('socket.io-client')('http://fydor.iok.la/');\nvar socket = __webpack_require__(80)('http://localhost:3000/');\nvar USER = '';\nvar connected = false;\n// setInterval(function(){\n// \tget_time();\n// },60000);\n\n$('.submit').click(function () {\n\t//点击发送聊天消息;\n\tsend_msg();\n\t$(\"#m\").val('');\n\temojeFadeOut();\n});\n\n$(document).on('click', function () {\n\temojeFadeOut();\n});\n\n/*登录函数*/\n$.loginFun = function () {\n\tvar username = $('.usernameInput').val().trim();\n\tif (username == '') return;\n\t$.get('http://localhost:3000/isExit', { username: username }, function (data) {\n\t\tconsole.log(data);\n\t\tif (data.isExit) {\n\t\t\t$(\".title\").text('名字已存在,换个吧');\n\t\t} else {\n\t\t\t//发送添加用户信息\n\t\t\tsocket.emit('add user', username);\n\t\t\tUSER = username;\n\t\t\t$(\".header\").html('\\u6B22\\u8FCE' + username + '\\u6765\\u5230\\u804A\\u5929\\u5BA4');\n\t\t\t$('.login').css({ \"transform\": \"translateY(-100%)\", \"transition\": '.5s' });\n\t\t\tsetTimeout(function () {\n\t\t\t\t$('.login').remove();\n\t\t\t}, 500);\n\t\t}\n\t});\n};\n$(window).keyup(function (event) {\n\tif (event.keyCode == 13) {\n\t\tif ($('.comfirm').length) {\n\t\t\t$.loginFun();\n\t\t\treturn;\n\t\t}\n\n\t\t//点击发送聊天消息;\n\t\tif (!$(\"#m\").val()) return;\n\t\tsend_msg();\n\t\t$(\"#m\").val('');\n\t\temojeFadeOut();\n\t}\n});\n\n$(\".usernameInput\").focus(function () {\n\t$(\".comfirm\").css(\"animation\", \".5s buttonIn both linear\");\n});\n\n/*点击注册按钮*/\n$('.comfirm').click(function () {\n\t$.loginFun();\n});\n\n/*接收后台返回消息*/\nsocket.on('chat message', function (msg) {\n\t/* 通过判断是否是自己发送的 添加对话消息 */\n\tvar result = msg.msg;\n\tvar reg = /\\[emoji:\\d*\\]/g,\n\t    emojiIndex,\n\t    match,\n\t    totalEmojiNum = $(\".emoji\").children().length;\n\twhile (match = reg.exec(result)) {\n\t\temojiIndex = match[0].slice(7, -1);\n\t\tif (emojiIndex > totalEmojiNum) {\n\t\t\tresult = result.replace(match[0], '[X]');\n\t\t} else {\n\t\t\tresult = result.replace(match[0], '<img  src=\"/dist/imgs/emoji/' + emojiIndex + '.gif\" />');\n\t\t}\n\t}\n\tconsole.log(result);\n\tmsg.msg = result;\n\tappend_other_msg(msg);\n});\n\n/*登录进来后 添加一条欢迎语*/\nsocket.on('login', function (data) {\n\tconnected = true;\n\tvar message = \"Welcome 欢迎来到聊天室 此聊天室 是一个很帅的开发员写的 只有你一个人能看见这句话哦! – \";\n\taddSystemMsg(message);\n\t//添加在线人数\n\tconsole.log(data);\n\tfor (var i = 0, len = data.Users.length; i < len; i++) {\n\t\taddOnlinePerson(data.Users[i].username, data.numUsers);\n\t}\n});\n\n/*监听用户加入的信息*/\nsocket.on('user joined', function (_ref) {\n\tvar username = _ref.username,\n\t    numUsers = _ref.numUsers;\n\n\tvar message = username + ' \\u7528\\u6237\\u52A0\\u5165\\u804A\\u5929\\u5BA4';\n\n\t//添加在线人数\n\taddOnlinePerson(username, numUsers);\n\t//添加系统信息\n\taddSystemMsg(message);\n});\n\n/*监听用户离开*/\nsocket.on('user left', function (_ref2) {\n\tvar username = _ref2.username,\n\t    numUsers = _ref2.numUsers,\n\t    Users = _ref2.Users;\n\n\tvar message = username + ' \\u7528\\u6237\\u79BB\\u5F00\\u804A\\u5929\\u5BA4';\n\t//添加系统信息\n\taddSystemMsg(message);\n\n\t//更新在线人员信息\n\t$('.online-persons').html('');\n\t//添加在线人数\n\tfor (var i = 0, len = Users.length; i < len; i++) {\n\t\taddOnlinePerson(Users[i].username, numUsers);\n\t}\n});\n\n//-------------帅气的分割线---------------------------\n\n/* 添加对话消息 */\nfunction append_other_msg(msg) {\n\tconsole.log(msg);\n\n\tvar s = msg.user == USER ? 'my-talk' : 'other-talk';\n\n\t$(\".talk\").append('<li class=\"' + s + '\">\\t\\t\\t\\t\\t\\t\\t<div class=\"minihead\" >\\t\\t\\t\\t\\t\\t\\t\\t<img src=\"/dist/imgs/emoji/headportrait.jpg\">\\t\\t\\t\\t\\t\\t\\t</div>\\t\\t\\t\\t\\t\\t\\t<p class=\"ctx\"><span style=\"color:red;\">' + msg.user + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color:gray\">(' + msg.time + ')</span><br> <span>' + msg.msg + '</span></p>\\t\\t\\t\\t\\t\\t</li>');\n\t$('.content').scrollTop($('.content')[0].scrollHeight + 30);\n}\n\n/*获取字体的颜色值*/\ngetFontColor();\nfunction getFontColor() {\n\t$('.color').on('change', function () {\n\t\tCOLOR = $(this).val();\n\t});\n}\n\n/*点击发送 */\nfunction send_msg() {\n\t//点击发送 \n\t$('#m').val().trim() == '' || socket.emit('chat messages', { 'msg': $('#m').val(), 'user': USER });\n\n\treturn false;\n}\n\n/* 添加时间戳 */\nfunction get_time() {\n\t$.get('http://localhost:3000/get_time', function (_ref3) {\n\t\tvar time = _ref3.time;\n\n\t\taddSystemMsg(time);\n\t});\n}\n\n/*添加在线人数*/\nfunction addOnlinePerson(username, numUsers) {\n\tvar msg = '<li class=\"ps\">\\n\\t\\t\\t\\t\\t<img src=\"/dist/imgs/emoji/headportrait.jpg\" alt=\"\">\\n\\t\\t\\t\\t\\t<span class=\"nick\">' + username + '</span>\\n\\t\\t\\t\\t</li>';\n\t$(\".show-person\").find('h3').text('\\u5F53\\u524D\\u5728\\u7EBF' + numUsers + '\\u4EBA');\n\t$('.online-persons').append(msg);\n}\n\n/*添加 系统信息*/\nfunction addSystemMsg(message) {\n\t$(\".talk\").append('<li class=\"time\">' + message + '</li>');\n}\n\n/*添加表情 并绑定点击事件*/\nadd_emoji();\nfunction add_emoji() {\n\tvar docFragment = document.createDocumentFragment();\n\tfor (var i = 1; i <= 69; i++) {\n\t\tvar emojiItem = document.createElement('img');\n\t\temojiItem.src = '/dist/imgs/emoji/' + i + '.gif';\n\t\temojiItem.title = i;\n\t\tdocFragment.appendChild(emojiItem);\n\t}\n\t$(\".emoji\").append(docFragment);\n\t$('.emoji').css('transform', 'translateY(-100%)');\n}\n\n/*点击 emoji按钮显示隐藏*/\ntarigger();\nfunction tarigger() {\n\t$('.emoji-btn').click(function () {\n\t\t$('.emoji').fadeToggle();\n\t\treturn false;\n\t});\n}\n\n/*隐藏表情包*/\nfunction emojeFadeOut() {\n\t$('.emoji').fadeOut();\n}\n\n/*点击表转换成文字*/\ntrun_img();\nfunction trun_img() {\n\t$('.emoji').click(function (e) {\n\t\tvar target = e.target;\n\t\tif (target.nodeName.toLowerCase() == 'img') {\n\t\t\t$('#m').val($('#m').val() + ('[emoji:' + target.title + ']'));\n\t\t}\n\t});\n}\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvcGFnZS9ob21lLmpzP2RhMWEiXSwibmFtZXMiOlsicmVxdWlyZSIsImkiLCJDT0xPUiIsIiQiLCJyZW1vdmUiLCJzb2NrZXQiLCJVU0VSIiwiY29ubmVjdGVkIiwiY2xpY2siLCJzZW5kX21zZyIsInZhbCIsImVtb2plRmFkZU91dCIsImRvY3VtZW50Iiwib24iLCJsb2dpbkZ1biIsInVzZXJuYW1lIiwidHJpbSIsImdldCIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiaXNFeGl0IiwidGV4dCIsImVtaXQiLCJodG1sIiwiY3NzIiwic2V0VGltZW91dCIsIndpbmRvdyIsImtleXVwIiwiZXZlbnQiLCJrZXlDb2RlIiwibGVuZ3RoIiwiZm9jdXMiLCJtc2ciLCJyZXN1bHQiLCJyZWciLCJlbW9qaUluZGV4IiwibWF0Y2giLCJ0b3RhbEVtb2ppTnVtIiwiY2hpbGRyZW4iLCJleGVjIiwic2xpY2UiLCJyZXBsYWNlIiwiYXBwZW5kX290aGVyX21zZyIsIm1lc3NhZ2UiLCJhZGRTeXN0ZW1Nc2ciLCJsZW4iLCJVc2VycyIsImFkZE9ubGluZVBlcnNvbiIsIm51bVVzZXJzIiwicyIsInVzZXIiLCJhcHBlbmQiLCJ0aW1lIiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0IiwiZ2V0Rm9udENvbG9yIiwiZ2V0X3RpbWUiLCJmaW5kIiwiYWRkX2Vtb2ppIiwiZG9jRnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZW1vamlJdGVtIiwiY3JlYXRlRWxlbWVudCIsInNyYyIsInRpdGxlIiwiYXBwZW5kQ2hpbGQiLCJ0YXJpZ2dlciIsImZhZGVUb2dnbGUiLCJmYWRlT3V0IiwidHJ1bl9pbWciLCJlIiwidGFyZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQkFBQUEsQ0FBUSxDQUFSO0FBQ0EsbUJBQUFBLENBQVEsQ0FBUjtBQUNBLG1CQUFBQSxDQUFRLENBQVI7QUFDQSxLQUFJ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QUFZaUQsTUFBWixDQUFtQlEsV0FBbkI7QUFDQXpELEdBQUUsUUFBRixFQUFZc0IsR0FBWixDQUFnQixXQUFoQixFQUE0QixtQkFBNUI7QUFDQTs7QUFFRDtBQUNBMEM7QUFDQSxTQUFTQSxRQUFULEdBQW1CO0FBQ2xCaEUsR0FBRSxZQUFGLEVBQWdCSyxLQUFoQixDQUFzQixZQUFVO0FBQy9CTCxJQUFFLFFBQUYsRUFBWWlFLFVBQVo7QUFDQSxTQUFPLEtBQVA7QUFDQSxFQUhEO0FBS0E7O0FBRUQ7QUFDQSxTQUFTekQsWUFBVCxHQUF1QjtBQUN0QlIsR0FBRSxRQUFGLEVBQVlrRSxPQUFaO0FBQ0E7O0FBRUQ7QUFDQUM7QUFDQSxTQUFTQSxRQUFULEdBQW1CO0FBQ2xCbkUsR0FBRSxRQUFGLEVBQVlLLEtBQVosQ0FBa0IsVUFBUytELENBQVQsRUFBVztBQUM1QixNQUFJQyxTQUFTRCxFQUFFQyxNQUFmO0FBQ0EsTUFBR0EsT0FBT0MsUUFBUCxDQUFnQkMsV0FBaEIsTUFBaUMsS0FBcEMsRUFBMEM7QUFDekN2RSxLQUFFLElBQUYsRUFBUU8sR0FBUixDQUFZUCxFQUFFLElBQUYsRUFBUU8sR0FBUixrQkFBMEI4RCxPQUFPUCxLQUFqQyxPQUFaO0FBQ0E7QUFDRCxFQUxEO0FBTUEsQyIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnLi4vLi4vY3NzL3Jlc2V0LmNzcycpO1xyXG5yZXF1aXJlKCcuLi8uLi9jc3MvaG9tZS5sZXNzJyk7XHJcbnJlcXVpcmUoJy4uLy4uL3ZpZXcvaG9tZS5odG1sJyk7XHJcbmZvcih2YXIgaSA9IDE7IGk8IDY5OyBpKyspe1xyXG5cdHJlcXVpcmUoJy4uLy4uL2ltZ3MvZW1vamkvJysgaSArJy5naWYnKTtcclxufVxyXG5sZXQgQ09MT1IgPSAnJztcclxuLyrosIPmlbTpobXpnaIgKi9cclxuJCgnLmxvZ2luJykucmVtb3ZlKCk7XHJcbi8vdmFyIHNvY2tldCA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKSgnaHR0cDovL2Z5ZG9yLmlvay5sYS8nKTtcclxudmFyIHNvY2tldCA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKSgnaHR0cDovL2xvY2FsaG9zdDozMDAwLycpO1xyXG5sZXQgVVNFUiA9ICcnO1xyXG52YXIgY29ubmVjdGVkID0gZmFsc2U7XHJcbi8vIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcbi8vIFx0Z2V0X3RpbWUoKTtcclxuLy8gfSw2MDAwMCk7XHJcblxyXG4kKCcuc3VibWl0JykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHQvL+eCueWHu+WPkemAgeiBiuWkqea2iOaBrztcclxuXHRzZW5kX21zZygpO1xyXG5cdCQoXCIjbVwiKS52YWwoJycpO1xyXG5cdGVtb2plRmFkZU91dCgpO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuXHRlbW9qZUZhZGVPdXQoKTtcclxufSlcclxuXHJcbi8q55m75b2V5Ye95pWwKi9cclxuJC5sb2dpbkZ1biA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHVzZXJuYW1lID0gJCgnLnVzZXJuYW1lSW5wdXQnKS52YWwoKS50cmltKCk7XHJcblx0aWYoIHVzZXJuYW1lID09ICcnKSByZXR1cm4gO1xyXG5cdCQuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvaXNFeGl0Jyx7dXNlcm5hbWU6dXNlcm5hbWV9LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRpZiAoZGF0YS5pc0V4aXQpIHtcclxuXHRcdFx0JChcIi50aXRsZVwiKS50ZXh0KCflkI3lrZflt7LlrZjlnKgs5o2i5Liq5ZCnJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly/lj5HpgIHmt7vliqDnlKjmiLfkv6Hmga9cclxuXHRcdFx0c29ja2V0LmVtaXQoJ2FkZCB1c2VyJyx1c2VybmFtZSk7XHJcblx0XHRcdFVTRVIgPSB1c2VybmFtZTtcclxuXHRcdFx0JChcIi5oZWFkZXJcIikuaHRtbChg5qyi6L+OJHt1c2VybmFtZX3mnaXliLDogYrlpKnlrqRgKTtcclxuXHRcdFx0JCgnLmxvZ2luJykuY3NzKHtcInRyYW5zZm9ybVwiOlwidHJhbnNsYXRlWSgtMTAwJSlcIixcInRyYW5zaXRpb25cIjonLjVzJ30pO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JCgnLmxvZ2luJykucmVtb3ZlKCk7XHJcblx0XHRcdH0sNTAwKVxyXG5cdFx0fVxyXG5cdH0pXHJcbn1cclxuJCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRpZihldmVudC5rZXlDb2RlID09IDEzKXtcclxuXHRcdGlmKCQoJy5jb21maXJtJykubGVuZ3RoKXtcclxuXHRcdFx0JC5sb2dpbkZ1bigpO1xyXG5cdFx0XHRyZXR1cm4gO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8v54K55Ye75Y+R6YCB6IGK5aSp5raI5oGvO1xyXG5cdFx0aWYoISQoXCIjbVwiKS52YWwoKSkgcmV0dXJuO1xyXG5cdFx0c2VuZF9tc2coKTtcclxuXHRcdCQoXCIjbVwiKS52YWwoJycpO1xyXG5cdFx0ZW1vamVGYWRlT3V0KCk7XHJcblx0fVxyXG59KSBcclxuXHJcblxyXG4kKFwiLnVzZXJuYW1lSW5wdXRcIikuZm9jdXMoZnVuY3Rpb24oKXtcclxuXHQkKFwiLmNvbWZpcm1cIikuY3NzKFwiYW5pbWF0aW9uXCIsXCIuNXMgYnV0dG9uSW4gYm90aCBsaW5lYXJcIik7XHJcbn0pXHJcblxyXG5cclxuXHJcbi8q54K55Ye75rOo5YaM5oyJ6ZKuKi9cclxuJCgnLmNvbWZpcm0nKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdCQubG9naW5GdW4oKTtcclxufSk7XHJcblxyXG4vKuaOpeaUtuWQjuWPsOi/lOWbnua2iOaBryovXHJcbnNvY2tldC5vbignY2hhdCBtZXNzYWdlJyxmdW5jdGlvbihtc2cpe1xyXG5cdC8qIOmAmui/h+WIpOaWreaYr+WQpuaYr+iHquW3seWPkemAgeeahCDmt7vliqDlr7nor53mtojmga8gKi9cclxuXHR2YXIgcmVzdWx0ID0gbXNnLm1zZztcclxuXHR2YXIgcmVnID0gL1xcW2Vtb2ppOlxcZCpcXF0vZyxlbW9qaUluZGV4LG1hdGNoLFxyXG5cdHRvdGFsRW1vamlOdW0gPSAkKFwiLmVtb2ppXCIpLmNoaWxkcmVuKCkubGVuZ3RoO1xyXG5cdHdoaWxlKG1hdGNoID0gcmVnLmV4ZWMocmVzdWx0KSl7XHJcblx0XHRlbW9qaUluZGV4ID0gbWF0Y2hbMF0uc2xpY2UoNywtMSk7XHJcblx0XHRpZihlbW9qaUluZGV4ID4gdG90YWxFbW9qaU51bSl7XHJcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKG1hdGNoWzBdLCdbWF0nKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZShtYXRjaFswXSwnPGltZyAgc3JjPVwiL2Rpc3QvaW1ncy9lbW9qaS8nICsgZW1vamlJbmRleCArICcuZ2lmXCIgLz4nKVxyXG5cdFx0fVxyXG5cdH1cclxuXHRjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG5cdG1zZy5tc2cgPSByZXN1bHQ7XHJcblx0YXBwZW5kX290aGVyX21zZyhtc2cpO1xyXG59KSAgXHJcblxyXG4vKueZu+W9lei/m+adpeWQjiDmt7vliqDkuIDmnaHmrKLov47or60qL1xyXG5zb2NrZXQub24oJ2xvZ2luJyxmdW5jdGlvbihkYXRhKXtcclxuXHRjb25uZWN0ZWQgPSB0cnVlO1xyXG5cdHZhciBtZXNzYWdlID0gXCJXZWxjb21lIOasoui/juadpeWIsOiBiuWkqeWupCDmraTogYrlpKnlrqQg5piv5LiA5Liq5b6I5biF55qE5byA5Y+R5ZGY5YaZ55qEIOWPquacieS9oOS4gOS4quS6uuiDveeci+ingei/meWPpeivneWTpiEg4oCTIFwiO1xyXG5cdGFkZFN5c3RlbU1zZyhtZXNzYWdlKTtcclxuXHQvL+a3u+WKoOWcqOe6v+S6uuaVsFxyXG5cdGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdGZvcih2YXIgaSA9IDAsbGVuID0gZGF0YS5Vc2Vycy5sZW5ndGg7IGk8IGxlbiA7IGkrKyl7XHJcblx0XHRhZGRPbmxpbmVQZXJzb24oIGRhdGEuVXNlcnNbaV0udXNlcm5hbWUsZGF0YS5udW1Vc2Vycyk7XHJcblx0fVxyXG5cdFxyXG59KVxyXG5cclxuLyrnm5HlkKznlKjmiLfliqDlhaXnmoTkv6Hmga8qL1xyXG5zb2NrZXQub24oJ3VzZXIgam9pbmVkJywoe3VzZXJuYW1lLG51bVVzZXJzfSk9PntcclxuXHR2YXIgbWVzc2FnZSA9YCR7dXNlcm5hbWV9IOeUqOaIt+WKoOWFpeiBiuWkqeWupGA7XHJcblx0XHJcblx0Ly/mt7vliqDlnKjnur/kurrmlbBcclxuXHRhZGRPbmxpbmVQZXJzb24odXNlcm5hbWUsbnVtVXNlcnMpO1xyXG5cdC8v5re75Yqg57O757uf5L+h5oGvXHJcblx0YWRkU3lzdGVtTXNnKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbi8q55uR5ZCs55So5oi356a75byAKi9cclxuc29ja2V0Lm9uKCd1c2VyIGxlZnQnLCh7dXNlcm5hbWUsbnVtVXNlcnMsVXNlcnN9KSA9PntcclxuXHR2YXIgbWVzc2FnZSA9YCR7dXNlcm5hbWV9IOeUqOaIt+emu+W8gOiBiuWkqeWupGA7XHJcblx0Ly/mt7vliqDns7vnu5/kv6Hmga9cclxuXHRhZGRTeXN0ZW1Nc2cobWVzc2FnZSk7XHJcblxyXG5cdC8v5pu05paw5Zyo57q/5Lq65ZGY5L+h5oGvXHJcblx0JCgnLm9ubGluZS1wZXJzb25zJykuaHRtbCgnJyk7XHJcblx0Ly/mt7vliqDlnKjnur/kurrmlbBcclxuXHRmb3IodmFyIGkgPSAwLGxlbiA9IFVzZXJzLmxlbmd0aDsgaTwgbGVuIDsgaSsrKXtcclxuXHRcdGFkZE9ubGluZVBlcnNvbiggVXNlcnNbaV0udXNlcm5hbWUsbnVtVXNlcnMpO1xyXG5cdH1cclxufSlcclxuXHJcbi8vLS0tLS0tLS0tLS0tLeW4heawlOeahOWIhuWJsue6vy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyog5re75Yqg5a+56K+d5raI5oGvICovXHJcbmZ1bmN0aW9uIGFwcGVuZF9vdGhlcl9tc2cobXNnKXtcclxuXHRjb25zb2xlLmxvZyhtc2cpO1xyXG5cdFxyXG5cdHZhciBzID0gbXNnLnVzZXIgPT0gVVNFUiA/ICdteS10YWxrJyA6ICdvdGhlci10YWxrJztcclxuXHRcclxuXHQkKFwiLnRhbGtcIikuYXBwZW5kKGA8bGkgY2xhc3M9XCIke3N9XCI+XFxcclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWluaWhlYWRcIiA+XFxcclxuXHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiL2Rpc3QvaW1ncy9lbW9qaS9oZWFkcG9ydHJhaXQuanBnXCI+XFxcclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXFxyXG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwiY3R4XCI+PHNwYW4gc3R5bGU9XCJjb2xvcjpyZWQ7XCI+JHttc2cudXNlcn08L3NwYW4+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7PHNwYW4gc3R5bGU9XCJjb2xvcjpncmF5XCI+KCR7bXNnLnRpbWV9KTwvc3Bhbj48YnI+IDxzcGFuPiR7bXNnLm1zZ308L3NwYW4+PC9wPlxcXHJcblx0XHRcdFx0XHRcdDwvbGk+YCk7XHJcblx0JCgnLmNvbnRlbnQnKS5zY3JvbGxUb3AoJCgnLmNvbnRlbnQnKVswXS5zY3JvbGxIZWlnaHQgKyAzMCk7XHJcbn1cclxuXHJcbi8q6I635Y+W5a2X5L2T55qE6aKc6Imy5YC8Ki9cclxuZ2V0Rm9udENvbG9yKCk7IFxyXG5mdW5jdGlvbiBnZXRGb250Q29sb3IoKXtcclxuXHQkKCcuY29sb3InKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0Q09MT1IgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vKueCueWHu+WPkemAgSAqL1xyXG5mdW5jdGlvbiBzZW5kX21zZygpe1xyXG5cdC8v54K55Ye75Y+R6YCBIFxyXG5cdCQoJyNtJykudmFsKCkudHJpbSgpID09ICcnIHx8IHNvY2tldC5lbWl0KCdjaGF0IG1lc3NhZ2VzJyx7J21zZyc6JCgnI20nKS52YWwoKSwndXNlcicgOiBVU0VSfSk7XHJcblx0XHJcblx0cmV0dXJuIGZhbHNlOyBcclxufVxyXG5cclxuLyog5re75Yqg5pe26Ze05oizICovXHJcbmZ1bmN0aW9uIGdldF90aW1lKCl7XHJcblx0JC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9nZXRfdGltZScsKHt0aW1lfSk9PntcclxuXHRcdGFkZFN5c3RlbU1zZyh0aW1lKTtcclxuXHR9KVx0XHJcbn1cclxuXHJcblxyXG4vKua3u+WKoOWcqOe6v+S6uuaVsCovXHJcbmZ1bmN0aW9uIGFkZE9ubGluZVBlcnNvbih1c2VybmFtZSxudW1Vc2Vycyl7XHJcblx0dmFyIG1zZyA9IGA8bGkgY2xhc3M9XCJwc1wiPlxyXG5cdFx0XHRcdFx0PGltZyBzcmM9XCIvZGlzdC9pbWdzL2Vtb2ppL2hlYWRwb3J0cmFpdC5qcGdcIiBhbHQ9XCJcIj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwibmlja1wiPiR7dXNlcm5hbWV9PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGk+YFxyXG5cdCQoXCIuc2hvdy1wZXJzb25cIikuZmluZCgnaDMnKS50ZXh0KGDlvZPliY3lnKjnur8ke251bVVzZXJzfeS6umApO1xyXG5cdCQoJy5vbmxpbmUtcGVyc29ucycpLmFwcGVuZChtc2cpO1xyXG59XHJcblxyXG5cclxuLyrmt7vliqAg57O757uf5L+h5oGvKi9cclxuZnVuY3Rpb24gYWRkU3lzdGVtTXNnKG1lc3NhZ2Upe1xyXG5cdCQoXCIudGFsa1wiKS5hcHBlbmQoYDxsaSBjbGFzcz1cInRpbWVcIj4ke21lc3NhZ2V9PC9saT5gKTtcclxufVxyXG4gXHJcbi8q5re75Yqg6KGo5oOFIOW5tue7keWumueCueWHu+S6i+S7tiovXHJcbmFkZF9lbW9qaSgpO1xyXG5mdW5jdGlvbiBhZGRfZW1vamkoKXtcclxuXHR2YXIgZG9jRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblx0Zm9yKHZhciBpPSAxOyBpPD0gNjk7IGkrKyl7XHJcblx0XHR2YXIgZW1vamlJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblx0XHRlbW9qaUl0ZW0uc3JjID0gJy9kaXN0L2ltZ3MvZW1vamkvJysgaSsgJy5naWYnO1xyXG5cdFx0ZW1vamlJdGVtLnRpdGxlID0gaTtcclxuXHRcdGRvY0ZyYWdtZW50LmFwcGVuZENoaWxkKGVtb2ppSXRlbSk7XHJcblx0fVxyXG5cdCQoXCIuZW1vamlcIikuYXBwZW5kKGRvY0ZyYWdtZW50KTtcclxuXHQkKCcuZW1vamknKS5jc3MoJ3RyYW5zZm9ybScsJ3RyYW5zbGF0ZVkoLTEwMCUpJylcclxufVxyXG5cclxuLyrngrnlh7sgZW1vamnmjInpkq7mmL7npLrpmpDol48qL1xyXG50YXJpZ2dlcigpO1xyXG5mdW5jdGlvbiB0YXJpZ2dlcigpe1xyXG5cdCQoJy5lbW9qaS1idG4nKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCgnLmVtb2ppJykuZmFkZVRvZ2dsZSgpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0pXHJcblxyXG59XHJcblxyXG4vKumakOiXj+ihqOaDheWMhSovXHJcbmZ1bmN0aW9uIGVtb2plRmFkZU91dCgpe1xyXG5cdCQoJy5lbW9qaScpLmZhZGVPdXQoKTtcclxufVxyXG5cclxuLyrngrnlh7vooajovazmjaLmiJDmloflrZcqL1xyXG50cnVuX2ltZygpO1xyXG5mdW5jdGlvbiB0cnVuX2ltZygpe1xyXG5cdCQoJy5lbW9qaScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cdFx0aWYodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2ltZycpe1xyXG5cdFx0XHQkKCcjbScpLnZhbCgkKCcjbScpLnZhbCgpICsgYFtlbW9qaToke3RhcmdldC50aXRsZX1dYCk7XHJcblx0XHR9XHJcblx0fSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9wYWdlL2hvbWUuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
])