var REG =/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

function ipToInt(ip){
    var xH = "",result = REG.exec(ip);
    if(!result) return -1;
    for (var i = 1; i <= 4; i++) {
        var h = parseInt(result[i]);
        xH += (h > 15 ? "" : "0") + h.toString(16);
    }
    return parseInt(xH, 16);
}

function intToIp(INT){
    if(INT < 0 || INT > 0xFFFFFFFF){
        throw ("The number is not normal!");
    }
    return (INT>>>24) + "." + (INT>>16 & 0xFF) + "." + (INT>>8 & 0xFF) + "." + (INT & 0xFF);
}

function nextIPv4(ipBase, hostNumber, prefix){
    var n1 = ipToInt(ipBase);
    var n2 = n1 + hostNumber;
    var ip = intToIp(n2) + "/" + prefix
    return ip;
}



function showTopos() {
    for (var k in components) {
        var t = components[k];
        console.log("----------------- component ---------------------" + typeof t);
        console.log(JSON.stringify(t));

    }
    console.log("----------------- main topology ---------------------" + typeof topology);
    console.log(JSON.stringify(topology));
    /*window.sessionStorage.setItem("shopcatCookits",JSON.stringify(topology));
    var shopcat = [];
    var shopcatCookit = window.sessionStorage.getItem("shopcatCookits");

    if (shopcatCookit){
        shopcat = shopcatCookit;
        //shopcat = JSON.parse(shopcat);
        shopcat = JSON.stringify(shopcat);
    }

    console.log(shopcat);*/
    $(document).ready(function () {
    $("input[name='name']").val(JSON.stringify(topology));
        /*$.ajax({
            url:"http://47.106.96.178:5001/registry/imagemgr/info",
            async:true,
            type:"POST",
            data:JSON.stringify(topology),
            success:function (data) {
                console.log(data);
            },
            error:function () {
                alert("请求失败");
            },
            dataType:"TEXT"
        });*/
})



    // if (template === true) {
    //     for (var k in components) {
    //         var t = components[k];
    //         console.log("----------------- component ---------------------" + typeof t);
    //         console.log(JSON.stringify(t));
    //
    //     }
    // } else {
    //     console.log("----------------- main topology ---------------------" + typeof topology);
    //     console.log(JSON.stringify(topology));
    // }

}
