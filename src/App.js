import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import './App.css'; // Import your CSS file if you have any
import { getDocument } from 'pdfjs-dist';
import '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs'

const App = () => {
    // State variables
    const [selectedFile, setSelectedFile] = useState(null);
    const [metadata, setMetadata] = useState(null);

    // Handler for file input change
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setMetadata(null);
    };

    // Handler for form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedFile) {
            // Read the file as an ArrayBuffer
            const reader = new FileReader();

            reader.onload = () => {
                // Load the PDF document
                const arrayBuffer = reader.result;
                getDocument({ data: arrayBuffer }).promise.then(pdf => {
                    // Extract metadata
                    pdf.getMetadata().then(metadata => {
                        // Update state with metadata
                        setMetadata(metadata.info);
                    }).catch(error => {
                        console.error("Error getting metadata:", error);
                        alert('Error extracting PDF metadata.');
                    });
                }).catch(error => {
                    console.error("Error loading PDF:", error);
                    alert('Error processing PDF file.');
                });
            };

            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                alert('Error reading the PDF file.');
            };

            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert('Por favor escolha um arquivo PDF.');
        }
    };

    // Convert value to string if it's an object
    const convertValueToString = (value) => {
        return value || '';
    };

  const expand = (key, value) => {
    if (key === "Custom") {
      return
      //return Object.entries(value).sort().map(([key, value]) => expand("Custom." + key, value))
    }
    if (key && key.replace) {
      key = key.replace('Ã§', 'ç')
      key = key.replace('Ã£', 'ã')
      key = key.replace('Ã¡', 'á')
    }
    return (
      <tr key={key}>
          <td>{key}</td>
          <td>{convertValueToString(value)}</td>
      </tr>
    )
  }

    return (
        <Container className="App">
            <h1>Visualizador de Metadados</h1>
            <main>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="pdfFile">Escolha um arquivo PDF:</Label>
                        <Input
                            id="pdfFile"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                    </FormGroup>
                    <Button color="primary" type="submit">
                        Visualizar Metadados
                    </Button>&nbsp;
                    <Button color="secondary" type="button" onClick={() => setSelectedFile(null)}>
                        Limpar 
                    </Button>
                </Form>

                {selectedFile && metadata && (
                  <>
                    <div style={{background: '#F3D7CA', color: 'black', padding: 10, marginTop: 20}}>
                      Arquivo PDF selecionado: {selectedFile.name}
                    </div>

                    {metadata.Custom && (
                    <Table className="mt-4" striped>
                        <thead>
                            <tr>
                                <th width="40%">Nome do metadado personalizado</th>
                                <th width="60%">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Object.entries(metadata.Custom).sort().map(([key, value]) => expand(key, value))}
                        </tbody>
                    </Table>
                    )}

                    <Table className="mt-4" striped>
                        <thead>
                            <tr>
                                <th width="40%">Nome do metadado padrão</th>
                                <th width="60%">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(metadata).sort().map(([key, value]) => expand(key, value))}
                        </tbody>
                    </Table>

                  </>
                )}
            </main>
        </Container>
    );
};

export default App;
