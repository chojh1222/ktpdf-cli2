import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
import 'reset-css/reset.css';
import "@babel/polyfill";
import * as React from 'react';
import DocumentContainer from '../../src/containers/desktop/Document';
import {getDocumentInfo} from "../../src/api/document/getDocumentInfo";
import {ISigner} from "../../src/interface/ISigner";
import {getDocumentInfoForSigner} from "../../src/api/signer/getDocumentInfoForSinger";

interface IDocumentProps {
  documentNo: string;
  documentUrl: string;
  signerList: Array<ISigner>;
  
  tmpDocId: string;
  tmpUserId: string;
  inputs:[];
}

interface IDocumentInfoAPIResponse {
  doc: string;

  docId: string;
  docName: string;
  fileName: string;
  filePath: string;
  userId: string; 
  signers: Array<ISigner>;  
}

const backgroundColorList = [
  'red',
  'green',
  'blue',
  'yellow',
  'orange',
  'pink',
  'purple',
  'gray',
  'black',
  'skyblue',
  'blanchedalmond',
  'brown',
  'chocolate',
  'darkgray',
  'darkkhaki',
  'khaki',
  'darkturquoise',
  'deeppink',
  'cadetblue',
  'cyan'
];

const defaultBackgroundColor = '#fff';

class Document extends React.Component<IDocumentProps, React.ComponentState> {

  static async getInitialProps({query}) {
    let documentNo = query.docNo;
    let {tmpDocId, tmpUserId } = query;
    return {documentNo, tmpDocId, tmpUserId};
  }

  constructor(props) {
    super(props);

    this.state = {
      documentNo: 0,
      signerList: [],
      documentUrl: '',
      inputs: []
    }
  }

  componentDidMount() {
    console.log("componentDidMount");
    const documentNo = this.props.documentNo;
    
    const {tmpDocId, tmpUserId} = this.props;
    // console.log("tmpDocId 1 : " + tmpDocId);
    // console.log("tmpUserId 2 : " + tmpUserId);

    // 템플릿 아이디가 있다면 기존 객체를 조회해본다.
    if(tmpDocId != undefined){
      console.log(" api 서버에서 조회를 시작한다.");
      getDocumentInfoForSigner(tmpDocId, tmpUserId)
      .then((data: any) => {
        this.setState({
          // signer: data.signer,
          // documentUrl: data.filePath,
          inputs: data.inputs
        });
      });
    }else{
      console.log("tmpDocId 1 is undefined ");
    }

    getDocumentInfo(documentNo)
      .then((data: IDocumentInfoAPIResponse) => {
        this.setState({
          // documentUrl: data.doc,
          documentNo: data.docId, // 문서아이디  
          docName: data.docName,
          fileName: data.fileName,      
          documentUrl: data.filePath, // 문서경로
          userId: data.userId, 
          signerList: data.signers
        })
      });      
  }

  render() {
    // const {documentNo} = this.props;
    const {documentNo} = this.props;
    const {documentUrl, signerList} = this.state;
    const {docName, fileName, userId} = this.state;

    // const {tmpDocId, tmpUserId} = this.props;
    // console.log("tmpDocId : " + tmpDocId);
    // console.log("tmpUserId : " + tmpUserId);
    const {inputs} = this.state;
    // console.log("============================= inputs 1222222");
    console.log(inputs);

    const users = signerList ? signerList.map((user, index) => ({
      ...user,
      backgroundColor: backgroundColorList[index] ? backgroundColorList[index] : defaultBackgroundColor,
      color: backgroundColorList.indexOf(String(index)) > -1 ? '#fff' : '#000'
    })) : [];

    if(users.length < 1) return null;

    return (
      <div>
        <DocumentContainer
          documentUrl={documentUrl}
          signerList={users}
          documentNo={documentNo}
          docName={docName}
          fileName={fileName}
          userId={userId}
          inputs={inputs}
        />
      </div>
    );
  }

}

export default Document;