import React from 'react';
import styled from 'styled-components';
import { KeyboardArrowLeft } from 'styled-icons/material/KeyboardArrowLeft';
import { KeyboardArrowRight } from 'styled-icons/material/KeyboardArrowRight';

const Rec = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px;
  height: 220px;
  width: 580px;
  background-color: rgb(255,255,255);
`;

const Picholder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 220px;
  width: 230px;
`;

const Picnavleft = styled(KeyboardArrowLeft)`
  height: 40px;
  width: 40px;
  margin-right: -40px;
  border-radius: 20px;
  color: white;
  z-index: 10;
  &:hover {
    background-color: #101820;
  }
`;

const Pic = styled.div`
  height: 220px;
  width: 230px;
  overflow: auto;
`;

const Picnavright = styled(KeyboardArrowRight)`
  height: 40px;
  width: 40px;
  margin-left: -40px;
  border-radius: 20px;
  color: white;
  z-index: 10;
  &:hover {
    background-color: #101820;
  }
`;

const Recbody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 25px;
  background-color: white;
  height: 100%;
  width: 350px;
`;

const Rectitle = styled.div`
  padding: 3px;
  width: 310px;
  font-size: 18px;
  line-height: 20px;
  border-bottom: 1px solid transparent;
  font-family: 'Calibre-Medium';
  text-transform: uppercase;
  transition-property: border-bottom;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: 0s;
  ${Rec}:hover & {
    border-bottom: 1px solid #b70038;
  }
`;

const Recprice = styled.div`
  padding: 3px;
  color: rgb(96,97,97);
  font-size: 15px;
  font-family: 'Calibre-Medium';
`;

const Logo = styled.div`
  height: 20px;
  width: 20px;
  padding-right: 5px;
`;

const Zagatrated = styled.div`
  display: flex;
  align-items: center;
  padding: 3px;
  font-size: 15px;
  font-family: 'Calibre-Medium';
`;

const Rectext = styled.div`
  font-size: 15px;
  padding: 3px;
  font-family: 'Calibre-Medium';
`;

class Recommendation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      imageIndex: 0
    };

    this.onLeftClick = this.onLeftClick.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
  }

  onLeftClick() {
    const lastIndex = this.props.rec.pics.length - 1;
    const { imageIndex } = this.state;
    const shouldResetIndex = imageIndex === 0;
    const index =  shouldResetIndex ? lastIndex : imageIndex - 1;

    this.setState({
      imageIndex: index
    });
  }

  onRightClick() {
    const lastIndex = this.props.rec.pics.length - 1;
    const { imageIndex } = this.state;
    const shouldResetIndex = imageIndex === lastIndex;
    const index =  shouldResetIndex ? 0 : imageIndex + 1;

    this.setState({
      imageIndex: index
    });
  }

  render() {
    return (
      <Rec>
        <Picholder>
          <Picnavleft onClick={this.onLeftClick}></Picnavleft>
          <Pic>
            <ImageSlide url={ this.props.rec.pics.split(',')[this.state.imageIndex] }/>
          </Pic>
          <Picnavright onClick={this.onRightClick}></Picnavright>
        </Picholder>
        <Recbody>
          <Rectitle>{this.props.rec.name}</Rectitle>
          <Recprice>{this.props.genre} <span>&#183;</span>  {this.props.rec.price}</Recprice>
          <Zagatrated>
            <Logo><img src="assets/logo.svg"/></Logo>ZAGAT RATED
          </Zagatrated>
          <Rectext>{this.props.rec.text}</Rectext>
        </Recbody>
      </Rec>
    );
  }
};

const ImageSlide = ({ url }) => {
  const styles = {
    backgroundImage: `url(${url})`,
    height: '220px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  };

  return (
    <div style={styles}></div>
  );
}

export default Recommendation;