### Card 卡片

卡片视图组件，组件名：``uni-card``，代码块： uCard。

**使用方式：**

在 ``script`` 中引用组件 

```javascript
import uniCard from "@/components/uni-card/uni-card.vue"
export default {
    components: {uniCard}
}
```

一般用法

```html
<uni-card 
    title="标题文字" 
    thumbnail="http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" 
    extra="额外信息" 
    note="Tips">
    内容主体，可自定义内容及样式
</uni-card>
```

内容通栏

```html
<uni-card 
    is-full="true" 
    title="DCloud" 
    thumbnail="http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" 
    extra="2018.12.12"
    note="Tips">
    内容主体，可自定义内容及样式，内容主体，可自定义内容及样式，内容主体，可自定义内容及样式
</uni-card>
```

**uniCard 属性说明：**

|属性名|类型|默认值	|说明|
|---|----|---|---|
|title|String|-|标题文字|
|extra|String|-|标题额外信息|
|note|String|-|底部信息|
|thumbnail|String|-|标题左侧缩略图|
|is-full|Boolean|false|卡片内容是否通栏，为true时将去除padding值|

**uniCard 事件说明：**

|事件称名|说明|返回参数|
|---|----|---|
|click|点击 uniCard 触发事件|-|


Tips

* 组件实际运行效果参考：[https://github.com/dcloudio/uni-ui](https://github.com/dcloudio/uni-ui)
* npm 使用方式参考：[https://ext.dcloud.net.cn/plugin?id=55](https://ext.dcloud.net.cn/plugin?id=55)