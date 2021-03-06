
import React from "react";
import * as d3 from "d3";
import Circle from './tooltips/circles'
import CandleStick from './tooltips/candleSticks'
/*
name={'priceDot'}
dataGrabber={dataGrabber}
x={xDate}
y={y}
data={data}
position={position}
options={options}
*/

const maxElForTransitions = 500
class Circles extends React.Component {
    constructor(props) {
        super(props);
        this.make = this.make.bind(this);
    }
    render() {
        let { x, y, name, position, data, options } = this.props
        const chart = d3.select(`#d3${name}`)

        if (data.length > 360) {
            const temp = [];
            const iterationAmount = parseInt(data.length / 360)
            for (let i = 0; i < data.length; i = i + iterationAmount) {
                temp.push(data[i]);
            }

            data = temp;
            x = d3.scaleLinear()
                .range(x.range())
                .domain([data.length, 0])
        }
        let OvelayTip = null;
        if (options.candleStick) {
            OvelayTip = CandleStick
        } else if(options.pricePoint){
            OvelayTip = Circle
        }
        return (
            <g id={`d3${name}`}>
                <OvelayTip
                    toolTipper={this.toolTipper}
                    deToolTipper={this.deToolTipper}
                    maxElForTransitions={maxElForTransitions}
                />
            </g>

        );

    }
    toolTipper(d) {
        const divEL = document.getElementById('d3Tooltip')

        let tips = ''
        if (d.date) tips = tips.concat(`<h1>${d.date}</h1>`)
        if (d.close) tips = tips.concat(`</br><h1>Close:$${d.close}</h1>`)
        if (d.open) tips = tips.concat(`</br><h1>Open:$${d.open}</h1>`)
        if (d.high) tips = tips.concat(`</br><h1>High:$${d.high}</h1>`)
        if (d.low) tips = tips.concat(`</br><h1>Low:$${d.low}</h1>`)
        if (d.ma[options.analRange]) tips = tips.concat(`</br><h1>Average:$${parseInt(d.ma[options.analRange])}</h1>`)
        if (d.rsi, 1) tips = tips.concat(`</br><h1>RSI:${Math.round(d.rsi, 1)}</h1>`)

        divEL.innerHTML = tips
        divEL.style.left = (d3.event.pageX - divEL.clientWidth / 2) + "px";
        const topPosition = d3.event.pageY - divEL.clientHeight * 1.1
        divEL.style.top = (topPosition > 0 ? topPosition : 0) + "px";
        divEL.style.opacity = '1'
    }
    deToolTipper(d) {
        divEL.style.opacity = '0';
    }
}



    const chart = d3.select(`#d3${name}`)


    // this function starts the process of making data bound d3 elements
    function maker(el, dataa, classname) {
        return el.selectAll(classname)
            .data(dataa)
    }

    const toolTipper = function (d) {
        let tips = ''
        if (d.date) tips = tips.concat(`<h1>${d.date}</h1>`)
        if (d.close) tips = tips.concat(`</br><h1>Close:$${d.close}</h1>`)
        if (d.open) tips = tips.concat(`</br><h1>Open:$${d.open}</h1>`)
        if (d.high) tips = tips.concat(`</br><h1>High:$${d.high}</h1>`)
        if (d.low) tips = tips.concat(`</br><h1>Low:$${d.low}</h1>`)
        if (d.ma[options.analRange]) tips = tips.concat(`</br><h1>Average:$${parseInt(d.ma[options.analRange])}</h1>`)
        if (d.rsi, 1) tips = tips.concat(`</br><h1>RSI:${Math.round(d.rsi, 1)}</h1>`)

        divEL.innerHTML = tips
        divEL.style.left = (d3.event.pageX - divEL.clientWidth / 2) + "px";
        const topPosition = d3.event.pageY - divEL.clientHeight * 1.1
        divEL.style.top = (topPosition > 0 ? topPosition : 0) + "px";
        divEL.style.opacity = '1'
    }
    const deToolTipper = function (d) {
        divEL.style.opacity = '0';
    }

    // if candlesticks option, make candlesticks out of d3 rect type.
    //  its centered on the highest of d.open or d.close, and a height of open-close (but since Y is reversed on the dom you do low-high)
    // sticks protrude to d.low, d.high
    // else append circles circles centered on d.close
    // bind the tooltips after
    let dataObj = null;
    let temp
    const maxElForTransitions = 500
    if (options.candleStick) {
        const lines = maker(chart, data, '.candleStickline')
        temp = lines.enter().append("line")
            .attr("class", "candleStick-stick child")
            .attr("x1", (d, i) => position[0] + x(i) + 1)
            .attr("y1", (d) => position[1] + y(Math.max(d.high, d.low)))
            .attr("x2", (d, i) => position[0] + x(i) + 1)
            .attr("y2", (d) => position[1] + y(Math.max(d.high, d.low)))
            .attr('stroke-width', 0)
            .attr("stroke", 'grey')


        // only apply transitions if there isnt too much data
        if (data.length < maxElForTransitions) {
            temp.transition() // apply a transition
                .duration(750)
                .attr("y2", (d) => position[1] + y(Math.min(d.high, d.low)))
                .attr("stroke-width", 1)
        } else {
            temp.attr("y2", (d) => position[1] + y(Math.min(d.high, d.low)))
                .attr("stroke-width", 1)
        }

        dataObj = maker(chart, data, '.bar')
        temp = dataObj.enter().append("rect")
            .attr("class", "candleStick child")
            .attr("x", (d, i) => position[0] + x(i))
            .attr("y", (d) => position[1] + y(Math.max(d.open, d.close)))
            .attr("width", 2)
            .attr("fill", (d) => d.change >= 0 ? "green" : "red")
            .on("mouseover", toolTipper)
            .on("mouseout", deToolTipper)
        // only apply transitions if there isnt too much data
        if (data.length < maxElForTransitions) {
            temp.transition() // apply a transition
                .duration(750)
                .attr("height", (d) => {
                    return y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close))
                })
        } else {
            temp.attr("height", (d) => {
                return y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close))
            })
        }
    }
    if (options.pricePoint) {
        dataObj = maker(chart, data, '.dot child')
        temp = dataObj.enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot child") // Assign a class for styling
            .attr("cx", ((d, i) => position[0] + x(i)))
            .attr("cy", (d) => position[1] + y(d.close))
            .attr("r", .1)
            .on("mouseover", toolTipper)
            .on("mouseout", deToolTipper)
        // only apply transitions if there isnt too much data
        if (data.length < maxElForTransitions) {
            temp.transition() // apply a transition
                .duration(750)
                .attr("r", 2)
        } else {
            temp.attr("r", 2)
        }
    }

