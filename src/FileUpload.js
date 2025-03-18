import { useState } from 'react';
import Papa from 'papaparse';
import { Table } from "antd";

const FileUpload = () => {

    const [csvData, setCsvData] = useState([]);

    const handleFiles = (event) => {
        const file = event.target.files[0];
        const fileType =
            file.name.split('.').pop().toLowerCase();
        if (fileType !== 'csv') {
            alert('Please upload a CSV file.');
            return;
        }
        Papa.parse(file, {
            complete: (result) => {
                setCsvData(result.data);
            },
            header: true,
        });
    };

    const columns = [
        {
          title: 'FirstName',
          dataIndex: 'FirstName',
          key: 'FirstName',
        },
        {
          title: 'LastName',
          dataIndex: 'LastName',
          key: 'LastName',
        },
        {
          title: 'Address',
          dataIndex: 'Address',
          key: 'Address',
        },
        {
            title: 'PhoneNumber',
            dataIndex: 'PhoneNumber',
            key: 'PhoneNumber',
          }
      ];

    return (
        <div>
            <div>
                <h1>File Upload</h1>
                <input type="file"
                    onChange={handleFiles}
                    accept=".csv" />
            </div>
            <div>
                {csvData.length > 0 && <Table dataSource={csvData} columns={columns} />}
            </div>
        </div>
    )
}
export default FileUpload;