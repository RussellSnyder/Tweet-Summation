import { useEffect, useState } from 'react'
import './App.css';


// var retweetRegex = /(?:retweet_count\\":)([0-9]+)/g

const getCountData = (searchString, text) => {
  var re = new RegExp("(?:" + searchString + "\\\\\":)([0-9]+)", "g");
  const matches = text.match(re);
  const counts = matches.map(m => parseInt(m.split(":")[1]))
  const count = counts.length;
  const frequency = counts.reduce((acc, curr) => acc + curr ,0)
  return {count, frequency}
}

function App() {
  const [data, setData] = useState()


  useEffect(async () => {
    try {
      const rawData = await fetch('/data/AMD_2015_tweets.json');
      const rawJson = await rawData.json();

      const allTests = rawJson.results[0].allTests;

      const formatedData = allTests.map(test => {

        const string = JSON.stringify(test);

        const retweets = getCountData('retweet_count', string)
        const replies = getCountData('reply_count', string)
        const likes = getCountData('like_count', string)
        const quotes = getCountData('quote_count', string)

        return {retweets, replies, likes, quotes}
      })

      const summation = formatedData.reduce((acc, current) => {
        acc.likes.count += current.likes.count;
        acc.likes.frequency += current.likes.frequency;
        acc.quotes.count += current.quotes.count;
        acc.quotes.frequency += current.quotes.frequency;
        acc.replies.count += current.replies.count;
        acc.replies.frequency += current.replies.frequency;
        acc.retweets.count += current.retweets.count;
        acc.retweets.frequency += current.retweets.frequency;
        return acc;
      },{
        likes: {
          count: 0,
          frequency: 0
        },
        quotes: {
          count: 0,
          frequency: 0
        },
        replies: {
          count: 0,
          frequency: 0
        },
        retweets: {
          count: 0,
          frequency: 0
        },
      })

      setData(summation)

      console.log(summation)
    } catch(e) {
      console.log(e);

    }

  }, [])

  if (data) {
    console.log(Object.values(data))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Shit for Dave</h1>
      </header>
      <div className="table-container">
        {data && <table>
          <thead>
            <tr>
              {Object.keys(data).map(d => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>              
              {Object.values(data).map((d, i) => <td key={d.count}>{d.count}</td>)}
            </tr>
            <tr>
              {Object.values(data).map(d => <td key={d.frequency}>{d.frequency}</td>)}
            </tr>
          </tbody>
        </table>}
      </div>
    </div>
  );
}

export default App;
