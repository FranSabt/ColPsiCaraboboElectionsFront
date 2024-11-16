import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './ElectionForm.css';

const ElectionFormList = () => {
  const [electionForms, setElectionForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Ahora mostrando 5 elementos por página
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    id: '',
    CI: '',
    fpv: '',
    address: ''
  });

  useEffect(() => {
    fetchElectionForms();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, electionForms]);

  const fetchElectionForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://colpsicaraboboelections-production.up.railway.app/elections-form');
      const sortedData = response.data.sort((a, b) => a.id - b.id);
      setElectionForms(sortedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let forms = electionForms;

    if (filter.id) {
      forms = forms.filter(form => form.id.toString().includes(filter.id));
    }
    if (filter.CI) {
      forms = forms.filter(form => form.CI.includes(filter.CI));
    }
    if (filter.fpv) {
      forms = forms.filter(form => form.fpv.includes(filter.fpv));
    }
    if (filter.address) {
      forms = forms.filter(form => form.address.includes(filter.address));
    }

    setFilteredForms(forms);
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleVoteStatusChange = async (id) => {
    const password = prompt("Por favor, ingrese la clave para anular/validar el voto:");
    if (!password) return;

    try {
      const response = await axios.put('https://colpsicaraboboelections-production.up.railway.app/elections-form', { id, password });
      alert(response.data);
      fetchElectionForms();
    } catch (error) {
      console.error('Error updating vote status: ', error);
      alert('Error al actualizar el estado del voto');
    }
  };

  const downloadExcel = () => { 
    const data = filteredForms.map(form => 
        ({ 
            id: form.id, 
            firstName: form.firstName, 
            secondName: form.secondName, 
            lastName: form.lastName, 
            secondLastName: form.secondLastName, 
            CI: `${form.CILetter}-${form.CI}`, 
            fpv: form.fpv, 
            email: form.email, 
            celPhone: form.celPhone, 
            address: form.address, 
            nulled: form.nulled ? 'Anulado' : 'Válido' 
        }
        )); 
        const worksheet = XLSX.utils.json_to_sheet(data); 
        const workbook = XLSX.utils.book_new(); 
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados"); 
        // Descargar archivo Excel 
        XLSX.writeFile(workbook, 'resultados_votaciones.xlsx'); 
    };

  // Obtener los elementos actuales
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  const convertBufferToImage = (buffer) => {
    if (buffer) {
      const binary = new Uint8Array(buffer.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      return `data:image/png;base64,${btoa(binary)}`;
    }
    return null;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; // Número máximo de botones de página a mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 2) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="container">
      <h1>Resultados de Votaciones</h1>
      <div className="filter-container">
        <label htmlFor="id">ID:</label>
        <input
          type="text"
          id="id"
          name="id"
          value={filter.id}
          onChange={handleFilterChange}
        />
        <label htmlFor="CI">CI:</label>
        <input
          type="text"
          id="CI"
          name="CI"
          value={filter.CI}
          onChange={handleFilterChange}
        />
        <label htmlFor="fpv">FPV:</label>
        <input
          type="text"
          id="fpv"
          name="fpv"
          value={filter.fpv}
          onChange={handleFilterChange}
        />
        <label htmlFor="address">Municipio:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={filter.address}
          onChange={handleFilterChange}
        />
      </div>
      <div className="vote-summary">
        <p>Total de Votos: {electionForms.length}</p>
        <p>Votos Filtrados: {filteredForms.length}</p>
        <button onClick={downloadExcel}>Descargar Resultados (con filtros)</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="pagination">
            <button onClick={() => paginate(1)}>Primera</button>
            {renderPageNumbers()}
            <button onClick={() => paginate(totalPages)}>Última</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nº de Voto</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>CI</th>
                <th>FPV</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Anulado</th>
                <th>Rif</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((form) => (
                <tr key={form.id}>
                  <td>{form.id}</td>
                  <td>{form.firstName} {form.secondName}</td>
                  <td>{form.lastName} {form.secondLastName}</td>
                  <td>{form.CILetter}-{form.CI}</td>
                  <td>{form.fpv}</td>
                  <td>{form.email}</td>
                  <td>{form.celPhone}</td>
                  <td>{form.address}</td>
                  <td>
                    <button
                      onClick={() => handleVoteStatusChange(form.id)}
                      style={{
                        backgroundColor: form.nulled ? 'red' : 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      {form.nulled ? 'Anulado' : 'Válido'}
                    </button>
                  </td>
                  <td>
                    {form.Rif && (
                      <img src={convertBufferToImage(form.Rif)} alt="RIF" width="100" />
                    )}
                  </td>
                  <td>
                    <a href={`https://colpsicaraboboelections-production.up.railway.app/elections-form/image/${form.id}`} target="_blank" rel="noopener noreferrer" className="download-button">
                      Descargar Imagen
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => paginate(1)}>Primera</button>
            {renderPageNumbers()}
            <button onClick={() => paginate(totalPages)}>Última</button>
          </div>
        </>
      )}
      <button onClick={fetchElectionForms} disabled={loading}>
        {loading ? 'Cargando...' : 'Recargar Datos'}
      </button>
    </div>
  );
};

export default ElectionFormList;
