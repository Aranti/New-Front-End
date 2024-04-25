import React from 'react';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';

const urls = baseUrl + process.env.REACT_APP_SEND_FILE_TO_BACKEND;

class UploadFile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null
        }
        
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.fileData = this.fileData.bind(this);
    }

    onFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    onFileUpload = () => {
        const formData = new FormData();

        formData.append("file", this.state.selectedFile, this.state.selectedFile.name);

        axios.post(urls, formData);
    }

    fileData = () => {
        if(this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    
                    <p>File Name: {this.state.selectedFile.name}</p>
                    
                                
                    <p>File Type: {this.state.selectedFile.type}</p>
                    
                                
                    <p>
                    Last Modified:{" "}
                    {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
        
                </div>
            );
        }
        else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h2>File Upload</h2>
                <div>
                    <input type="file" name='file' onChange={this.onFileChange} />
                    <button onClick={this.onFileUpload}>
                        Upload
                    </button>
                </div>
                {this.fileData()}
            </div>
        );
    }
}

export default UploadFile;