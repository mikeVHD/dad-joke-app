import React, { Component } from 'react';
import axios from "axios";
import uuid from 'react-uuid';
import './JokeList.css';
import Joke from './Joke';

class JokeList extends Component{

    static defaultProps= {
        numJokesToGet:10
    };
    constructor(props){
        super(props);
        this.state= { jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]") ,
        loading:false};
        this.handleClick=this.handleClick.bind(this);
    }
    
        componentDidMount(){
          if(this.state.jokes.length===0) this.getJokes()
           }

        async getJokes(){
               //load jokes
        let jokes=[];
        while(jokes.length < this.props.numJokesToGet){
            let res= await axios.get("https://icanhazdadjoke.com/" ,  {
            headers:{Accept:"application/json"}
        });
        jokes.push({ id:uuid() , text:res.data.joke , votes:0 });
    }
    //{jokes:jokes}
       this.setState(st=>({
           loading:false,
           jokes:[...st.jokes, ...jokes]
       }),
        ()=>window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));
       
           }
    
    handleVote(id , delta){
        this.setState(st =>({
            jokes:st.jokes.map(j=>
                j.id===id? {...j, votes:j.votes + delta}:j)
        }),
        ()=>window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }

    handleClick(){
        this.setState({loading:true},  this.getJokes)
      }
     
    render(){
        if(this.state.loading){
            return(
                <div className="spinner">
                    <i className="far fa-8x fa-laugh fa-spin" />
                    <h1 className='JokeList-title'>Loading...</h1>
                </div>
            )
        }
        return(
            
          <div className='JokeList'>
              <div className='JokeList-sidebar'>
                 <h1 className='JokeList-title'>
                  <span>Dad</span> Jokes
                 </h1>
                 <img
                 src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
                  />
                  <button className='JoleList-getMore' onClick={this.handleClick}>New Jokes</button>
              </div>
             
                <div className='JokeList-Jokes'>
                    {this.state.jokes.map(j=>(
                        <Joke 
                        votes={j.votes}
                         text={j.text} 
                         upvote={()=>this.handleVote(j.id,1)}
                         downvote={()=>this.handleVote(j.id,-1)}
                         />
                   ))}
                </div>
          </div>
        );
    }
}
export default JokeList;