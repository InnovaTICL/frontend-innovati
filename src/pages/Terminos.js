import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../styles/theme.css";

function Terminos() {
  useEffect(() => {
    document.title = "Términos y Condiciones – InnovaTi";
  }, []);

  return (
    <div className="page-wrapper py-5 bg-light">
      <Container className="content-wrap">
        <h2 className="fw-bold mb-4 text-gradient">Términos y Condiciones</h2>

        <p>
          Bienvenido a <strong>InnovaTi</strong>. Al acceder o utilizar nuestro sitio web o
          contratar nuestros servicios, usted acepta estos Términos y Condiciones en su
          versión vigente. Le recomendamos leerlos detenidamente antes de continuar.
        </p>

        <h5 className="fw-semibold mt-4">1. Prestación de servicios</h5>
        <p>
          InnovaTi es una consultora tecnológica con domicilio en Chile, dedicada al desarrollo
          a medida, soluciones Cloud/DevOps e integraciones. Los servicios se prestan de acuerdo
          con el contrato específico que suscriba el Cliente, este sitio web no constituye contrato
          alguno por sí mismo.
        </p>

        <h5 className="fw-semibold mt-4">2. Registro y acceso</h5>
        <p>
          El Cliente podrá acceder a un portal de clientes tras autenticación. Usted se compromete
          a utilizar credenciales seguras y a no cederlas ni permitir su uso no autorizado.
        </p>

        <h5 className="fw-semibold mt-4">3. Condiciones de pago y facturación</h5>
        <p>
          Los servicios se facturan según los términos acordados en el contrato. En caso de atraso
          en el pago, InnovaTi podrá suspender el servicio tras aviso previo. Los montos pueden
          ajustarse previa notificación con al menos 30 días de anticipación.
        </p>

        <h5 className="fw-semibold mt-4">4. Propiedad intelectual</h5>
        <p>
          Todos los elementos gráficos, código, logotipos, diseños, documentos y demás contenidos
          generados por InnovaTi o bajo su encargo serán propiedad de InnovaTi, salvo que se pacte
          lo contrario. El uso del sitio web no implica cesión de derechos de propiedad intelectual.
        </p>

        <h5 className="fw-semibold mt-4">5. Responsabilidad</h5>
        <p>
          InnovaTi no se hace responsable por daños directos, indirectos, emergentes, especiales o
          consecuenciales que puedan derivarse del uso del sitio web o de los servicios, salvo en los
          casos en que la ley no lo permita. La responsabilidad total de InnovaTi estará limitada al valor
          total pagado por el Cliente durante los últimos doce (12) meses.
        </p>

        <h5 className="fw-semibold mt-4">6. Cancelación o terminación</h5>
        <p>
          Cada contrato podrá prever plazos, formas de terminación anticipada, efectos de la rescisión y obligaciones pendientes. En ausencia de cláusula específica, cualquiera de las partes podrá dar por terminado el contrato con al menos treinta (30) días de aviso.
        </p>

        <h5 className="fw-semibold mt-4">7. Modificaciones a los términos</h5>
        <p>
          Estos Términos y Condiciones pueden modificarse por InnovaTi en cualquier momento. Las modificaciones entrarán en vigor tras su publicación en este sitio web y notificación al Cliente. Es su responsabilidad revisar periódicamente la versión vigente.
        </p>

        <h5 className="fw-semibold mt-4">8. Ley aplicable y jurisdicción</h5>
        <p>
          Estos Términos se regirán por las leyes de la República de Chile. Para cualquier controversia que surja en relación con estos Términos, ambas partes se someten a los tribunales competentes de Santiago de Chile.
        </p>

        <p className="text-muted mt-5">
          Última actualización: <strong>octubre 2025</strong>
        </p>
      </Container>
    </div>
  );
}

export default Terminos;
