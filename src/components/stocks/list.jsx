import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/stocklist.css';

export default class List extends React.Component {
    constructor(props) {
        super(props);
        console.log('list comp',props);
        if (this.props.data === undefined) {
            console.log('List.jsx error:', 'list must be passed props.data.headers and props.data.entries');            
        }
        // this.state.headers=['ticker','price','volume'];
        // this.state.entries = [['aapl', 123, 432234], ['zaag', 321, 678686]];
        
        
    }
    

    tableMaker(headers = this.props.data.headers || [], entries = this.props.data.entries || []) {
        return (
            <tbody>
                <tr>
                    {headers.map((header,i) => <th key={`${header}+${i}`}>{header}</th>)}
                </tr>
                {entries.map((entry,i) => (
                    <tr key={`${entry} + ${i}`}>
                        <Link to={`/stocks/${entry['symbol'] || entry['ticker'] || entry['name'] || entry['company']}`}>
                            {headers.map((header,j) => <th key={`${entry[header]}+${i}+${j}`}>{entry[header]}</th>)}
                        </Link>
                    </tr> 
                )
                )}
            </tbody>
        );
    }
    render(){
        return(
            <main className='stockList'>
                <table >
                    {this.tableMaker()}
                </table>
            </main>
        );
    }
}