# timeline-animation-edtior

![图片](https://github.com/rainbowMorelhahahah/timeline-animation-edtior/blob/1.0.0/2023-02-08%2018.32.39.gif?raw=true)

If you need a timeline reat component,make AE PS WebGL Animation timeline editor。

Then this component is a good choice。

## How to use

```js
<AnimationTimelineBox
    rows={[
        {
            keyframesInfo: [
                {
                    // mush value ，This is milliseconds
                    value: 100,
                    //
                    data: {
                        //other info
                    },
                },
                {
                    value: 2000,
                },
                {
                    value: 7000,
                },
            ],
        },
        {
            keyframesInfo: [
                {
                    value: 100,
                },
                {
                    value: 80.005 * 1000,
                },
            ],
        },
    ]}
/>
```

Current progress

1. Virtual list，You don't have to worry about having too many dom nodes to make the editor stick
2. Key frame management
