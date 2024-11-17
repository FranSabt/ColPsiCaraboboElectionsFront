import  { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './App.css';  // Añade esta línea para importar los estilos
import './Exito.css';
import Instrucciones from './Instrucciones';
import SELLO from './assets/COlPSi.jpeg'

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Ingrese su primer nombre'),
  secondName: Yup.string(),
  lastName: Yup.string().required('Ingrese su primer apellido'),
  secondLastName: Yup.string(),
  CI: Yup.string().required('Falta su número de CI'),
  psi: Yup.string().required('Escriba el nombre del Psicologo usted considere, debe representar a su municipio.'),
  CILetter: Yup.string().oneOf(['V', 'E']).required('Required'),
  fpv: Yup.string().required('Falta su número de FPV'),
  email: Yup.string().email('Invalid email').required('Se requiere un correo electronico válido'),
  celPhone: Yup.string().matches(/^(0412|0414|0424|0416|0426)?\d{7}$/, 'Invalid phone number').required('El número de celular debe ser válido'),
  address: Yup.string().oneOf([
    'Bejuma',
    'Guigue',
    'Mariara',
    'Guacara',
    'Morón',
    'Tocuyito',
    'Los Guayos',
    'Miranda',
    'Montalbán',
    'Naguanagua',
    'Puerto Cabello',
    'San Diego',
    'San Joaquín',
    'Valencia'
  ]).required('Elija su municipio'),
  Rif: Yup.mixed().required('Se requiere una foto de su RIF'),
});

// constants.js
export const MunicipioCapitalEnum = {
  BEJUMA: 'Bejuma',
  CARLOS_ARVELO: 'Guigue',
  DIEGO_IBARRA: 'Mariara',
  GUACARA: 'Guacara',
  JUAN_JOSE_MORA: 'Morón',
  LIBERTADOR: 'Tocuyito',
  LOS_GUAYOS: 'Los Guayos',
  MIRANDA: 'Miranda',
  MONTALBAN: 'Montalbán',
  NAGUANAGUA: 'Naguanagua',
  PUERTO_CABELLO: 'Puerto Cabello',
  SAN_DIEGO: 'San Diego',
  SAN_JOAQUIN: 'San Joaquín',
  VALENCIA: 'Valencia',
};

export const App = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      secondName: '',
      lastName: '',
      secondLastName: '',
      CI: '',
      CILetter: 'V',
      fpv: '',
      email: '',
      celPhone: '',
      address: '',
      psi: "",
      Rif: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      try {
        const response = await axios.post('https://colpsicaraboboelections-production.up.railway.app/elections-form', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        const data = response.data;
        setIsSubmitting(false)
        if (data.succes){
          setSubmitted(true);  // Marcamos el formulario como enviado
        } else {
          alert(data.msj)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const isAfter3pm = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
  
    // Verifica si la hora actual es después de las 3pm
    if (currentHour > 15 || (currentHour === 15 && currentMinutes > 0)) {
      return true;
    }
    return false;
  };
  

  return submitted ? (
    <ThankYouMessage />
  ) : (
    <form onSubmit={formik.handleSubmit} className="form-container">
      <h1>Votaciones de Representantes Municipales Carabobo 2024</h1>
      {/* <img src={SELLO} alt="Banner" className="banner-image" /> */}
        <img src={SELLO} alt="Banner" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} />
      <Instrucciones />
      <div>
        <label htmlFor="firstName">Primer Nombre</label>
        {formik.errors.firstName ? <div className="error-message">{formik.errors.firstName}</div> : null}
      </div>

      <div>
        <label htmlFor="secondName">Segundo Nombre</label>
        <input
          id="secondName"
          name="secondName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.secondName}
        />
      </div>

      <div>
        <label htmlFor="lastName">Primer Apellido</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.lastName}
          className={formik.errors.lastName ? 'input-error' : ''}
        />
        {formik.errors.lastName ? <div className="error-message">{formik.errors.lastName}</div> : null}
      </div>

      <div>
        <label htmlFor="secondLastName">Segundo Apellido</label>
        <input
          id="secondLastName"
          name="secondLastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.secondLastName}
        />
      </div>

      <div>
        <label htmlFor="CILetter">Tipo de documento</label>
        <select
          id="CILetter"
          name="CILetter"
          onChange={formik.handleChange}
          value={formik.values.CILetter}
        >
          <option value="V">V</option>
          <option value="E">E</option>
        </select>
        {formik.errors.CILetter ? <div className="error-message">{formik.errors.CILetter}</div> : null}
      </div>

      <div>
        <label htmlFor="CI">CI</label>
        <input
          id="CI"
          name="CI"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.CI}
          className={formik.errors.CI ? 'input-error' : ''}
        />
        {formik.errors.CI ? <div className="error-message">{formik.errors.CI}</div> : null}
      </div>

      <div>
        <label htmlFor="fpv">Número de FPV</label>
        <input
          id="fpv"
          name="fpv"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.fpv}
          className={formik.errors.fpv ? 'input-error' : ''}
        />
        {formik.errors.fpv ? <div className="error-message">{formik.errors.fpv}</div> : null}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className={formik.errors.email ? 'input-error' : ''}
        />
        {formik.errors.email ? <div className="error-message">{formik.errors.email}</div> : null}
      </div>

      <div>
        <label htmlFor="celPhone">Número de Telefóno Celular</label>
        <input
          id="celPhone"
          name="celPhone"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.celPhone}
          className={formik.errors.celPhone ? 'input-error' : ''}
        />
        {formik.errors.celPhone ? <div className="error-message">{formik.errors.celPhone}</div> : null}
      </div>

      <div>
        <label htmlFor="address">Municipio de Residencia</label>
        <select
          id="address"
          name="address"
          onChange={formik.handleChange}
          value={formik.values.address}
          className={formik.errors.address ? 'input-error' : ''}
        >
          <option value="">Seleccione su municipio</option>
          {Object.values(MunicipioCapitalEnum).map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </select>
        {formik.errors.address ? <div className="error-message">{formik.errors.address}</div> : null}
      </div>

      <div>
        <label htmlFor="Rif">Foto de su RIF</label>
        <input
          id="Rif"
          name="Rif"
          type="file"
          onChange={(event) => formik.setFieldValue('Rif', event.target.files[0])}
          className={formik.errors.Rif ? 'input-error' : ''}
        />
        {formik.errors.Rif ? <div className="error-message">{formik.errors.Rif}</div> : null}
      </div>

      <div>
        <label htmlFor="psi">Representante a Elegir</label>
        <input
          id="psi"
          name="psi"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.psi}
          className={formik.errors.psi ? 'input-error' : ''}
        />
        {formik.errors.psi ? <div className="error-message">{formik.errors.psi}</div> : null}
      </div>

      {!isSubmitting ? 
      <button 
        type="submit" disabled={isAfter3pm()} 
        style={{ padding: '10px 20px', backgroundColor: isAfter3pm() 
            ? '#ccc' : '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: isAfter3pm() 
            ? 'not-allowed' : 'pointer', 
          }} > ENVIAR VOTO </button>
      
      :
      
      <button style={{ backgroundColor: '#FFA500', color: 'white' }} disabled={true}>Enviando Voto</button>
    }
    </form>
  );
};

const ThankYouMessage = () => (
<div className="success-container"> 
  <div className="success-message"> 
    <i className="fas fa-check-circle"></i> ¡Voto registrado con éxito! Gracias por tu participación. 
    </div>
    </div>
);

export default App;
``