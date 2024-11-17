import './Instrucciones.css'

const Instrucciones = () => {
  return (
    <div className="instructions-container">
      <h2>Formulario del Ejercicio Único del Voto para Elegir Representantes de los Municipios</h2>
      <p><strong>Día:</strong> Domingo 17 de noviembre de 2024.</p>
      <p><strong>Modalidad:</strong> Online - Formulario</p>
      <p><strong>Hora:</strong></p>
      <ul>
        <li>Inicio de votación: 09:00 am.</li>
        <li>Cierre de votación: 03:00 pm.</li>
      </ul>
      
      <h3>Requisitos para el ejercicio del voto online:</h3>
      <ol>
        <li>Ser Psicólogo con título expedido por una Universidad Nacional.</li>
        <li>Estar inscrito en ColPsiCarabobo.</li>
        <li>Nro. de FPV asignado.</li>
        <li>R.I.F. vigente que indique que vive en el Municipio donde ejercerá su voto.</li>
      </ol>
      
      <h3>Pasos para ejercer el voto online</h3>
      <ol>
        <li>R.I.F. digitalizado.</li>
        {/*  eslint-disable-next-line react/no-unescaped-entities */}
        <li>Ingresar el link: "Formulario del ejercicio único del voto para elegir representantes de los municipios".</li>
        <li>Completar cada una de las preguntas descritas en el formulario, adjunta el R.I.F., escribe el nombre del Representante de tu Municipio a Elegir y presionar el botón “ENVIAR VOTO”.</li>
        <li>Recibirás un correo de confirmación de tu voto con un código único que hace constar que ejerciste tu voto.</li>
      </ol>
      
      <p><em>DECÍDETE…con tu participación activa podemos hacer la diferencia.</em></p>
      
      <blockquote>
        <p>¡Orgullosos del servicio enfocado en el agremiado activo. Trabajando en la construcción del Colegio que nos merecemos!</p>
        <footer><cite>Consejo Directivo Colegio de Psicólogos del Estado Carabobo</cite></footer>
      </blockquote>
    </div>
  )
}

export default Instrucciones
