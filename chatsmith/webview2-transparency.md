@Ivshti Yes, with recent version of webview2 it is possible to make the background transparent. We can run dx9 in the back and HTML UI in the front, just as sketched in the first post. Using win32 (ICoreWebView2Environment).

```
           COREWEBVIEW2_COLOR wvColor;
            wvColor.R = 255;
            wvColor.G = 255;
            wvColor.B = 255;
            wvColor.A = 0;
            
            wil::com_ptr<ICoreWebView2Controller2> controller2 = webviewController.query<ICoreWebView2Controller2>();
            controller2->put_DefaultBackgroundColor(wvColor);
```


###### Published by Nathan R