import { useState } from 'react';
import Papa from 'papaparse';
import { Table, Input, Button, Popconfirm, Modal, Form } from "antd";
import './App.css';

const FileUpload = () => {

    const [csvData, setCsvData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

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
                console.log('res', result.data);
                setCsvData(result.data);
            },
            header: true,
            skipEmptyLines: true,
        });
    };

    // const EditableCell = ({
    //     title,
    //     editable,
    //     children,
    //     record,
    //     index,
    //     ...restProps
    // }) => {
    //     return (
    //         <td {...restProps}>
    //             {editable ? (
    //                 <Input
    //                     value={children}
    //                     onChange={e => onFieldChange(e.target.value, record.key, title)}
    //                 />
    //             ) : children}
    //         </td>
    //     );
    // };

    // const onFieldChange = (value, key, field) => {
    //     const newData = [...csvData];
    //     const index = newData.findIndex(item => item.key === key);
    //     if (index > -1) {
    //         newData[index][field] = value;
    //         setCsvData(newData);
    //     }
    // };

    const validateRow = (row) => {
        const errors = [];

        if (!/^[A-Za-z]+$/.test(row.FirstName)) {
            errors.push('FirstName should contain only alphabetic characters');
        }
        if (!/^[A-Za-z]+$/.test(row.LastName)) {
            errors.push('LastName should contain only alphabetic characters');
        }
        if (!/^\d+$/.test(row.PhoneNumber)) {
            errors.push('PhoneNumber should contain only numbers');
        }

        return errors;
    };

    const handleValidateRows = () => {
        const updatedData = [...csvData];

        updatedData.forEach((row, index) => {
            const errors = validateRow(row);
            console.log('err', errors)
            if (errors.length > 0) {
                updatedData[index] = { ...row, errors };
            } else {
                updatedData[index] = { ...row, errors: [] };
            }
        });
        setCsvData(updatedData);
    };

    const handleDelete = (data) => {
        setCsvData(csvData.filter(item => item.Id !== data));
    };

    const getRowClassName = (record) => {
        return record.errors && record.errors.length > 0 ? 'invalid-row' : '';
    };

    const columns = [
        {
            title: 'FirstName',
            dataIndex: 'FirstName',
            editable: true,
        },
        // {
        //     title: 'FirstName',
        //     dataIndex: 'FirstName',
        //     render: (row) => {
        //         <span>{row.FirstName}</span>
        //     }
        // },
        {
            title: 'LastName',
            dataIndex: 'LastName',
            editable: true,
        },
        {
            title: 'Address',
            dataIndex: 'Address',
            editable: true,
        },
        {
            title: 'PhoneNumber',
            dataIndex: 'PhoneNumber',
            editable: true,
        },
        {
            title: 'Action',
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm title="Are you sure to delete this row?" onConfirm={() => handleDelete(record.Id)}>
                        <Button type="link">Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // const mergedColumns = columns.map(col => ({
    //     ...col,
    //     onCell: record => ({
    //       record,
    //       editable: editingKey === record.key,
    //       title: col.title,
    //       children: record[col.dataIndex],
    //     }),
    //   }));

    const handleEdit = (record) => {
        setCurrentRecord(record);
        setIsModalVisible(true);
    };

    const handleFieldChange = (value, field) => {
        setCurrentRecord({
            ...currentRecord,
            [field]: value,
        });
    };

    const handleSave = () => {
        const newData = [...csvData];
        const index = newData.findIndex((item) => item.Id === currentRecord.Id);
        if (index > -1) {
            newData[index] = currentRecord;
            setCsvData(newData);
            setIsModalVisible(false);
        }
    };

    const downloadCSV = () => {
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'table_data.csv';
        link.click();
    }

    return (
        <div>
            <div>
                <h1>File Upload</h1>
                <input type="file"
                    onChange={handleFiles}
                    accept=".csv" />
            </div>
            <div>
                {csvData.length > 0 &&
                    <div>
                        <Button
                            type="primary"
                            onClick={handleValidateRows}
                            style={{ marginBottom: 20, marginTop: 20 }}>
                            Validate Rows
                        </Button>
                        <Table
                            // components={{
                            //     body: {
                            //         cell: EditableCell,
                            //     },
                            // }}
                            dataSource={csvData}
                            columns={columns}
                            rowClassName={getRowClassName}
                            pagination={false}
                            bordered
                            rowKey="Id"
                        />
                        <Modal
                            title="Edit Row"
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            onOk={handleSave}>
                            <Form layout="vertical">
                                <Form.Item label="FirstName">
                                    <Input
                                        value={currentRecord?.FirstName}
                                        onChange={(e) => handleFieldChange(e.target.value, 'FirstName')}
                                    />
                                </Form.Item>
                                <Form.Item label="LastName">
                                    <Input
                                        value={currentRecord?.LastName}
                                        onChange={(e) => handleFieldChange(e.target.value, 'LastName')}
                                    />
                                </Form.Item>
                                <Form.Item label="Address">
                                    <Input
                                        value={currentRecord?.Address}
                                        onChange={(e) => handleFieldChange(e.target.value, 'Address')}
                                    />
                                </Form.Item>
                                <Form.Item label="PhoneNumber">
                                    <Input
                                        value={currentRecord?.PhoneNumber}
                                        onChange={(e) => handleFieldChange(e.target.value, 'PhoneNumber')}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                        {/* <Table dataSource={csvData} columns={columns} /> */}
                        <Button
                            type="primary"
                            onClick={downloadCSV}
                            style={{ marginTop: 20 }}>
                            Download CSV File
                        </Button>
                    </div>}
            </div>
        </div>
    )
}
export default FileUpload;