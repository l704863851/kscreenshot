import { css } from '../../util'
import backToPreImg from '../backToPreImg'
import makeSnapShoot from '../makeSnapShoot'

export default function rectBT (me) {
    let rectBT = document.createElement('span')
    rectBT.id = 'kssRectBT'
    rectBT.title = '方形工具'

    css(rectBT, {
        display: 'inline-block',
        width: '30px',
        height: '30px',
        'text-align': 'center',
        float: 'right',
        cursor: 'pointer'
    })

    let rectImg = document.createElement('img')
    rectImg.src = '../../assets/imgs/rect.png'
    me.rectBT = rectBT
    css(rectImg, {
        width: '20px',
        height: '20px',
        'margin-top': '5px'
    })

    rectBT.appendChild(rectImg)

    rectBT.addEventListener('click', function () {
        me.isEdit = true
        
        if (me.currentToolType === 'rect') {
            return
        }
     
        me.currentToolType = 'rect'

        if (me.toolmousedown) {
            me.rectangleCanvas.removeEventListener('mousedown', me.toolmousedown)
            document.removeEventListener('mousemove', me.toolmousemove)
            document.removeEventListener('mouseup', me.toolmouseup)
        }

        me.rectangleCanvas.addEventListener('mousedown', rectMousedownEvent)
        me.toolmousedown= rectMousedownEvent

        function rectMousedownEvent (e) {
            if (e.button === 2) {
                return
            }
            let startX = e.clientX - me.startX
            let startY = e.clientY - me.startY
            
            document.addEventListener('mousemove', rectMousemoveEvent)
            document.addEventListener('mouseup', rectMouseupEvent)
            me.toolmousemove = rectMousemoveEvent
            me.toolmouseup = rectMouseupEvent

            function rectMousemoveEvent (e) {
                backToPreImg(me)
                let context = me.rectangleCanvas.getContext("2d")
                let endX = e.clientX
                let endY = e.clientY

                if (endX < me.startX) {
                    endX = me.startX
                } else if (endX > (me.startX + me.width)) {
                    endX = me.startX + me.width
                }

                endX -= me.startX

                if (endY < me.startY) {
                    endY = me.startY
                } else if (endY > (me.startY + me.height)) {
                    endY = me.startY + me.height
                }

                endY -= me.startY

                context.beginPath()
                context.moveTo(Math.min(startX, endX), Math.min(startY, endY))
                context.lineTo(Math.max(startX, endX), Math.min(startY, endY))
                context.lineTo(Math.max(startX, endX), Math.max(startY, endY))
                context.lineTo(Math.min(startX, endX), Math.max(startY, endY))
                context.lineTo(Math.min(startX, endX), Math.min(startY, endY))
                context.lineWidth = 1
                context.strokeStyle = me.toolbarColor
                context.stroke()  
                context.closePath()
            }

            function rectMouseupEvent (e) {
                document.removeEventListener('mousemove', rectMousemoveEvent)
                document.removeEventListener('mouseup', rectMouseupEvent)
                makeSnapShoot(me)
            }
        }
    })

    return rectBT
}