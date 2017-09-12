/*************************************************************
* 	https://github.com/kytster/AJAX										       *
*************************************************************/

function AJAX_(DefaultErrorHandler,DefaultParser,DefaultSplashScreen){
	var AJAX_HTTP_Request_=function(clbk,flsh,prsr,errh){
		var clbk=clbk,flsh=flsh,prsr=prsr,errh=errh;
		var reqobj=null;
		this.Ready=false;
		if(window.XMLHttpRequest&&typeof window.XMLHttpRequest!="undefined")reqobj=new XMLHttpRequest();
		else{
			errh('AJAX error: XMLHttpRequest not supported.');
			return;
		}
		if(!reqobj)errh('AJAX error: can not create XMLHttpRequest object.');
		reqobj.onreadystatechange=function(){
			var st;
			flsh(reqobj.readyState);
			if(reqobj.readyState==4){
				try{st=reqobj.status;}
				catch(e){st=false;}
				if(!st||reqobj.status > 1000)errh('AJAX error: no response from server.');
				else{
					if(reqobj.status==200){
						var psd=prsr(reqobj.responseText,errh);
						if(psd)clbk(psd);
					}else errh('AJAX error: data transmission fault. Received: '+reqobj.status+' - '+reqobj.statusText);
				}
			}
		}
		this.GET=function(url){
			try{reqobj.open('GET',url,true);}
			catch(e){
				errh('AJAX error: can not open connection. Received: '+e.description);
				return;
			}
			reqobj.send(null);
		}
		this.POST=function(url,dat){
			try{
				reqobj.open('POST',url,true);
				reqobj.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				reqobj.send(dat);
			}
			catch(e){errh('AJAX error: can not send data. Received: '+e.description);}
		}
		this.Ready=true;
	}
	var fl=null,cnt=0;
	this.DefaultSplashScreen=DefaultSplashScreen||function(state){
		if(!fl){
			fl=document.createElement('DIV');
			fl.style.position='absolute';fl.style.zIndex=2000;fl.style.display='none';
			fl.style.backgroundImage="url(data:image/png;base64,"+
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1"+
				"FB98BFgYrNUPgYFEAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAAA1JREFUCNdjYGBgmAkAAJ4Amrj2EpEAAAAASUVORK5CYII=)";
		}
		if(!fl.parent)document.body.appendChild(fl);
		if(state >3){
			cnt--;cnt=cnt < 0 ? 0 : cnt;
			if(cnt==0||state >4)fl.style.display='none';
		}else{
			if(fl.style.display=='none'){
				fl.style.display='block';
				fl.style.top='0px';fl.style.left='0px';
				fl.style.height=((window.innerHeight)?window.innerHeight:
					(document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight))+'px';
				fl.style.width=((window.innerWidth)?window.innerWidth:
					(document.documentElement.clientWidth?document.documentElement.clientWidth:document.body.clientWidth))+'px';
				cnt++;
			}
		}
	}
	this.DefaultParser=DefaultParser||function(r,errh){
		if(r.substr(0,3).toLowerCase()=='err'){
			errh('AJAX error: server application error. Received: '+r); 
			return false;
		}
		try{var d=eval('('+r+')');}
		catch(e){
			errh('AJAX error: wrong response format. Received: '+r);
			return false;
		}
		return d;
	}
	this.DefaultErrorHandler=DefaultErrorHandler||function(err){alert(err);}
	this.sendRequest=function(url,dat,Callback,SplashScreen,Parser,ErrorHandler,mod){
		var clbk=Callback||function(r){};
		var flsh=SplashScreen?(typeof(SplashScreen)=='function'?SplashScreen:function(r){}):this.DefaultSplashScreen;
		var prsr=Parser?(typeof(Parser)=='function'?Parser:function(r){return r;}):this.DefaultParser;
		var errh=this.DefaultErrorHandler;
		var hfl=5;
		if(ErrorHandler){
			if(typeof(ErrorHandler)=='function')errh=ErrorHandler;
			else{
				hfl=4;
				if(typeof(ErrorHandler)=='string'&&ErrorHandler.substr(0,1).toLowerCase()=='c')errh=clbk;
				else errh=function(r){};
			}
		} 
		//var errh=ErrorHandler?(typeof(ErrorHandler)=='function'?ErrorHandler:function(r){}):this.DefaultErrorHandler;
		var erhw=function(errmsg){flsh(hfl);errh(errmsg);};
		var req=new AJAX_HTTP_Request_(clbk,flsh,prsr,errh);
		if(req&&req.Ready){
			if(mod)req.POST(url,dat);
			else req.GET(url);
		}
	}
	this.GET=function(url,Callback,SplashScreen,Parser,ErrorHandler){
		this.sendRequest(url,null,Callback,SplashScreen,Parser,ErrorHandler,false);
	}
	this.POST=function(url,dat,Callback,SplashScreen,Parser,ErrorHandler){
		this.sendRequest(url,dat,Callback,SplashScreen,Parser,ErrorHandler,true);
	}
}
