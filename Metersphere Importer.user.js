// ==UserScript==
// @name         Metersphere Importer
// @namespace    http://tampermonkey.net/
// @version      2024-06-12
// @description  简易的metersphere用例导入工具
// @author       Aoi_Sora
// @match        *://cloud2.metersphere.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    function createButton(){
        var button = document.createElement('button');
        button.textContent = '开始自动导入';
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.bottom = '10px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        // 定义按钮点击事件的处理函数
        async function submit_fetching()
        {
            let a = -1;
            let b = -1;
            function sleep(time){
                return new Promise((resolve) => setTimeout(resolve, time));
            }
            let btn = document.querySelector("#app > section > section > main > div.ms-main-view.ms-aside-right > div > div:nth-child(2) > div > div.case-edit-box > div.edit-footer-container > div.save-btn-row > button");
            btn.click();
            let headers_dict = {};
            XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, addr){
                if(b===-1){
                    let request_header = this.setRequestHeader;
                    this.setRequestHeader = function(name,value){
                        headers_dict[name] = value;
                        request_header.apply(this,[name,value]);
                    }
                    b = 1;
                }
                this.realOpen.apply(this, arguments);
            };
            let waited_text;
            XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(body) {
                if(a===-1)
                {
                    a = body;
                    waited_text = a.get("request").text();
                }
                // 调用原始的send方法
                this.realSend.apply(this, arguments);
            };
            await sleep(1000);
            let web_addr = "https://cloud2.metersphere.com/track/test/case/add";
            headers_dict["content-type"]="multipart/form-data; boundary=----WebKitFormBoundaryMeuZ9GpYZWA4CroM";
            headers_dict["accept"]="application/json, text/plain, */*";
            let json = await waited_text;
            let fetch_object = {
                "headers":headers_dict,
                "referrer": "https://cloud2.metersphere.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "method": "POST",
                "mode": "cors",
                "credentials": "include",
                "body": "------WebKitFormBoundaryMeuZ9GpYZWA4CroM\r\nContent-Disposition: form-data; name=\"request\"; filename=\"blob\"\r\nContent-Type: application/json\r\n\r\n"+ json +"\r\n------WebKitFormBoundaryMeuZ9GpYZWA4CroM--\r\n"
            };
            let fix_body = fetch_object.body;
            let args = [{
                "用例名称": "测试用例A_0",
                "前置条件": "测试条件",
                "步骤描述": "111",
                "预期结果": "1111111"
            },
            {
                "用例名称": "测试用例A_1",
                "前置条件": "测试条件2",
                "步骤描述": "2222",
                "预期结果": "22222222"
            }];
            for(let i = 0; i<args.length;i++){
                fetch_object.body = fix_body.replace("case_name",args[i]["用例名称"]).replace("case_text_desc",args[i]["步骤描述"]).replace("case_condition",args[i]["前置条件"]).replace("case_predict",args[i]["预期结果"]);
                fetch(web_addr,fetch_object);
                button.textContent = "正在添加："+i+"/"+args.length;
                console.log("正在添加："+i+"/"+args.length);
                await sleep(1500);
            }
            button.textContent = "导入完成！共"+args.length;
        }
        // 添加点击事件监听器
        button.addEventListener('click', submit_fetching);
        // 将按钮添加到页面中
        document.body.appendChild(button);
    }
    createButton();
    // Your code here...
})();