import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../styles/theme.css";

function Privacidad() {
  useEffect(() => {
    document.title = "Política de Privacidad – InnovaTi";
  }, []);

  return (
    <div className="page-wrapper py-5 bg-light">
      <Container className="content-wrap">
        <h2 className="fw-bold mb-4 text-gradient">Política de Privacidad</h2>

        <p>
          En <strong>InnovaTi</strong> (“InnovaTi”, “nosotros”), valoramos su privacidad y nos
          comprometemos a proteger la información personal que usted comparte con nosotros. Esta
          política explica cómo recopilamos, usamos, almacenamos y protegemos sus datos personales
          conforme a la Ley 21.719 sobre Protección de Datos Personales y demás normativa aplicable
          en Chile.
        </p>

        <h5 className="fw-semibold mt-4">1. Responsable del tratamiento</h5>
        <p>
          Responsable: <strong>InnovaTi SpA</strong>. Correo de contacto:{" "}
          <a
            href="mailto:contacto@innovati.cl"
            className="text-decoration-none fw-semibold"
          >
            contacto@innovati.cl
          </a>.
        </p>

        <h5 className="fw-semibold mt-4">2. Datos personales que tratamos</h5>
        <ul>
          <li>Datos de identificación y contacto: nombre, correo electrónico, teléfono, empresa y cargo.</li>
          <li>Datos contractuales o administrativos asociados a servicios y facturación.</li>
          <li>Datos técnicos de uso del sitio: IP, páginas visitadas, y métricas de navegación.</li>
        </ul>

        <h5 className="fw-semibold mt-4">3. Finalidades del tratamiento</h5>
        <ul>
          <li>Responder consultas y solicitudes enviadas a través del sitio.</li>
          <li>Brindar y gestionar los servicios contratados.</li>
          <li>Cumplir obligaciones legales, contables y tributarias.</li>
          <li>Mejorar la experiencia y seguridad del sitio web.</li>
        </ul>

        <h5 className="fw-semibold mt-4">4. Bases legales del tratamiento</h5>
        <ul>
          <li>Ejecución o preparación de un contrato en el que usted es parte.</li>
          <li>Consentimiento libre, informado e inequívoco cuando sea requerido.</li>
          <li>Cumplimiento de obligaciones legales.</li>
          <li>Interés legítimo en mantener y mejorar nuestros servicios.</li>
        </ul>

        <h5 className="fw-semibold mt-4">5. Conservación de los datos</h5>
        <p>
          Conservamos los datos personales solo por el tiempo necesario para cumplir las finalidades
          informadas o las exigencias legales aplicables. Posteriormente, los eliminamos o
          anonimizamos.
        </p>

        <h5 className="fw-semibold mt-4">6. Encargados y terceros</h5>
        <p>
          Podemos compartir datos con proveedores de servicios tecnológicos o administrativos
          (hosting, correo, analítica), quienes actúan como encargados del tratamiento y están
          sujetos a deberes de confidencialidad y seguridad.
        </p>

        <h5 className="fw-semibold mt-4">7. Transferencias internacionales</h5>
        <p>
          Si los datos se transfieren fuera de Chile, garantizamos que el destinatario cumpla un
          nivel adecuado de protección o que exista su consentimiento expreso o habilitación legal.
        </p>

        <h5 className="fw-semibold mt-4">8. Seguridad de la información</h5>
        <p>
          Aplicamos medidas técnicas y organizativas apropiadas para proteger los datos frente a
          accesos no autorizados, pérdida o alteración. Sin embargo, ningún sistema es
          completamente infalible.
        </p>

        <h5 className="fw-semibold mt-4">9. Derechos de los titulares</h5>
        <p>
          Usted puede solicitar en cualquier momento el acceso, rectificación, eliminación,
          portabilidad o bloqueo de sus datos personales, conforme a la Ley 21.719. Para ejercer
          estos derechos, envíe un correo a{" "}
          <a
            href="mailto:contacto@innovati.cl"
            className="text-decoration-none fw-semibold"
          >
            contacto@innovati.cl
          </a>{" "}
          indicando su solicitud. Le responderemos dentro de un plazo máximo de 30 días corridos.
        </p>

        <h5 className="fw-semibold mt-4">10. Cookies</h5>
        <p>
          Este sitio utiliza cookies para mejorar su experiencia de navegación y analizar el tráfico.
          Puede configurar su navegador para rechazarlas o eliminarlas en cualquier momento.
        </p>

        <h5 className="fw-semibold mt-4">11. Cambios a esta política</h5>
        <p>
          Podemos actualizar esta Política de Privacidad para reflejar cambios normativos o mejoras
          internas. Publicaremos siempre la fecha de la última modificación.
        </p>

        <p className="text-muted mt-5">
          Última actualización: <strong>octubre 2025</strong>
        </p>
      </Container>
    </div>
  );
}

export default Privacidad;
