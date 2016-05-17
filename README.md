# Jquery.popup.js 

Modals and popups for you applications.

default includes
* js/jquery.popup.min.js
* And Latest jquery


## Getting Started

```
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="js/jquery.popup.min.js"></script>
```

### Installing

Used default:
```
$('#elem').popup();
```

Used click and animate.css:
```
 $('.btn').on('click',function () {
    $('.item').popup({
        time: 1000,
        classAnimateShow: 'rollIn',
        classAnimateHide: 'hinge',
        onPopupClose: function e(){ console.log('closed') },
        onPopupInit: function e(){ console.log('opened') }
    });
});
```


### Settings

Used default options:
```
$('#elem').popup({
      background: "#000",
      position: "absolute",
      opacity: .5,
      zIndex: 123456788,
      classAnimateShow: '',  // animate class, link https://daneden.github.io/animate.css/
      classAnimateHide: '',  // animate class, link https://daneden.github.io/animate.css/
      time: 400,
      onPopupClose: function(){},  // popup close after function
      onPopupInit: function(){}  // popup init after function
});
```

scale - default css transform

### Method closed

```
$('#elem').popup('close');  // close popup
```

### Version

0.1.1

### License

MIT


