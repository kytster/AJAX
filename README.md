# AJAX

Simple AJAX javascript object for use when you do not want (or can not) use any framework or library that has built-in AJAX functionality.

# API

Constructor
    
    var Ajax = new AJAX_(DefaultErrorHandler, DefaultParser, DefaultSplashScreen);

        where:
        
        DefaultErrorHandler (function, optional) - defines a function to be used as error handler by default 
            (further calls to GET and POSt methods can redefine error handler for particular call). 
            The function receives a string with error message (see below), when called. 
            If omitted, null or false - the built-in error handler is used (just alert(error message)).
        
        DefaultParser (function, optional) - defines a function for parsing (decoding/converting) a server 
            message before transferring the message to the callback function.  
            If omitted, null or false - the built-in parser is used. The built-in parser treats server message 
            as JSON string and tries to restore (unserialise) an object or array from the string. 
            Restored object is passed to the callback function then. If unserialization fails the error handler
            is called with appropriate error message and the parser returns false.
        
        DefaultSplashScreen (function, optional) - defines a function for showing a splash screen or animation 
            or somthing alike to the user while waiting responce from server. 
            If omitted, null or false - the built-in splash screen (dimmed layer over the whole window which 
            contains the Ajax object definition) is used. 
            The function receives integer representing the current state of connection, when called,. 
            The recognised states are:
              0 - Initialisation;
              1 - Establising connection;
              2 - Sending a request;
              3 - Receiving data;
              4 - Complited;
              5 - Error occured;

Metods
    
   The object has two methods corresponded to HTTP methods GET and POST.
   
   .GET(url, Callback, SplashScreen, Parser, ErrorHandler)
   
   .POST(url, dat, Callback, SplashScreen, Parser, ErrorHandler)
   
        where:
        
        url (string) - URL for request according to HTTP specs. Can be absolute or relative.
        
        dat (string) - Data for POST request according to HTTP specs (urlencoded).
        
        Callback (function, optional) - function which receives control after server response to the request. 
            The function receives parsed server response. 
            If the Parser is disabled when the method is called (see below), the function receives raw server 
            response as string. If omitted, null or false - nothing happens.
        
        SplashScreen (function/boolean/any, optional) - allows to redefine or disable DefaultSplashScreen 
            for particular request.
            If function - the function is used instead of DefaultSplashScreen.
            If omitted null or false - the DefaultSplashScreen is used.
            in any other case splash screen is disabled (silent mode).
        
        Parser (function/boolean/any, optional) - allows to redefine or disable DefaultParser for particular 
            request. If function - the function is used instead of DefaultParser. The function receives raw 
            server response as string, when called, and should return parsed response which is passed to 
            Callback. If omitted, null or false - the DefaultParser is used.
            In any other case parsing is switched off, and Callback reseived raw server response as string.
        
        ErrorHandler (function/boolean/string, optional) - allows to redefine or disable DefaultErrorHandler 
            for particular request. If function - the function is used instead of DefaultErrorHandler.
            The function receives error message as string (see below).
            If omitted, null or false - the DefaultErrorHandler is used.
            If string, beginning with letter 'C' (case insensitive), then dedicated error handlier is 
            disabled and error message is passed to Callback.
            In any other case error handling is disabled.
            Note! The Сallback should not be called in case of an error. But I came across a situation where 
                  Callback was called with the "false" as an argument. I believe I fixed it, but I'm not sure. 
                  Just in case, I advise to check the argument in the Сallback.
            
Error messages
   
   Following error messages are provided.
        
        Connection errors:
        
                AJAX error: XMLHttpRequest not supported. 
                AJAX error: can not create XMLHttpRequest object.
                AJAX error: no response from server.
                AJAX error: data transmission fault. Received: <error message received>
                AJAX error: can not open connection. Received: <error message received>
                AJAX error: can not send data. Received: <error message received>
                
        Parser error:
        
                AJAX error: wrong response format. Received: <message received from server in raw format>
        

