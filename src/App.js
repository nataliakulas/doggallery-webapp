import React from 'react';
import {Container, Row, Col} from 'react-grid-system';


const getPictures = (page) =>
  `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f30805949d59829de1f62b774103a3c2&text=dogs&per_page=100&page=${page}&format=json&nojsoncallback=1`;


const setPictures = (resp) => ({
  pictures: resp.photos.photo,
  page: resp.photos.page,
  loading: false,
  error: false,
  message: ''
});

const loadPictures = (resp) => (prevState) => ({
  pictures: [...prevState.pictures, ...resp.photos.photo],
  page: resp.photos.page,
  loading: false,
  error: false,
  message: ''
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      page: null,
      loading: false,
      error: false,
      message: ''
    }
  }

  componentDidMount() {
    this.fetchPictures(0);
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100) && this.state.pictures.length > 0 && !this.state.loading) {
      this.fetchPictures(this.state.page + 1)
    }
  };

  fetchPictures = (page) => {
    this.setState({loading: true});

    fetch(getPictures(page))
      .then(resp => resp.json())
      .then(resp => {
        if (resp.message) {
          this.setState({loading: false, error: true, message: resp.message});
        }
        else {
          if (page === 0) {
            this.setState(setPictures(resp))
          } else {
            this.setState(loadPictures(resp))
          }
        }
      })
  };

  render() {
    return (
      <div className="background">
        <Container>
          <Row>
            <Col xs={12} sm={10} offset={{sm: 1}}>
              {this.state.loading ?
                <div className="gallery-loader">
                  <div className="ball"/>
                </div> :
                <div className="gallery-wrapper">
                  {this.state.pictures.length > 0 && this.state.pictures.map(picture => {
                    let path = 'https://farm' + picture.farm + '.staticflickr.com/' + picture.server + '/' + picture.id + '_' + picture.secret + '_s.jpg';

                    return <img key={picture.id} src={path} alt={'dogs'}/>
                  })}
                  {this.state.error &&
                  <div className="error">
                    <p>An error occured!</p>
                    <p>{this.state.message}</p>
                  </div>}
                </div>
              }
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
