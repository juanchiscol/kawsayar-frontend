import { historialStyles } from "@/styles/historial-styles";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ExportToPDFProps {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    edad: string;
    fecha_nacimiento: string;
    sexo: string;
    controles: any[];
    isLoading: boolean;
}

const ExportToPDF = ({
    nombres,
    apellido_paterno,
    apellido_materno,
    dni,
    edad,
    fecha_nacimiento,
    sexo,
    controles,
    isLoading,
}: ExportToPDFProps) => {

    // Agrupar controles por mes
    const groupedByMonth = controles.reduce((acc: { [key: string]: any[] }, control: { fecha_creacion: string; id: number; }) => {
        const month = moment(control.fecha_creacion).format("MMM, YYYY");
        if (!acc[month]) acc[month] = [];
        acc[month].push(control);
        return acc;
    }, {});

    // Ordenar los meses
    const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => moment(b, "MMM, YYYY").diff(moment(a, "MMM, YYYY")));

    const formatDate = (date: Date) => moment(date).format("DD [de] MMMM YYYY");
    const formatTime = (date: Date) => moment(date).format("hh:mm A");

    const exportToPDF = async () => {
        try {
            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);

            // Generar el contenido HTML para el perfil
            const profileHTML = `
                <div class="text-center py-4 mb-8 rounded-xl bg-blue shadow-xl border border-gray-700">
          <h1 class="text-3xl font-bold mb-4 text-gray-700 tracking-wide">${nombres} ${apellido_paterno} ${apellido_materno}</h1>
          <div class="flex justify-center gap-2 mt-4 flex-wrap">
            <div class="bg-gray-700/80 px-4 py-2 rounded-full border border-gray-800 text-gray-700">
              <span class="font-medium">DNI:</span> ${dni}
            </div>
            <div class="bg-gray-700/80 px-4 py-2 rounded-full border border-gray-800 text-gray-700">
              <span class="font-medium">Edad:</span> ${edad} años
            </div>
            <div class="bg-gray-700/80 px-4 py-2 rounded-full border border-gray-800 text-gray-700">
              <span class="font-medium">Nacimiento:</span> ${fecha_nacimiento || "No disponible"}
            </div>
            <div class="bg-gray-700/80 px-4 py-2 rounded-full border border-gray-800 text-gray-700">
              <span class="font-medium">Sexo:</span> ${sexo || "No disponible"}
            </div>          
          </div>
        </div>
            `;

            // Generar el contenido de los controles
            const controlsHTML = sortedMonths.map((month) => {
                const monthControls = groupedByMonth[month]
                    .map((control: any) => {
                        const hasAnemia = control.tiene_anemia;
                        const probability = hasAnemia ? (control.probabilidad_anemia || 0) * 100 : (control.probabilidad_no_anemia || 0) * 100;
                        const statusColor = hasAnemia ? "border-red-600" : "border-green-600";
                        const statusText = hasAnemia ? "con índices de anemia" : "sin índices de anemia";
                        const statusText2 = hasAnemia ? "Con índices de anemia" : "Sin índices de anemia";
                        const improvedStatus = control.mejoro ? "✓ Mejoró" : "✗ No mejoró";
                        const improvedColor = control.mejoro ? "text-green-300" : "text-red-300";
                        return `
              <div class="border-l-4 ${hasAnemia ? 'border-red-600' : 'border-green-600'} bg-white rounded-lg mb-4 p-6 shadow-xl border border-gray-700">
                <div class="flex justify-between items-center mb-3 flex-wrap">
                  <h3 class="text-gray-700 font-medium flex items-center gap-2">
                    <span class="text-purple-500">📅</span> ${formatDate(control.fecha_creacion)} 
                    <span class="text-purple-500">•</span> 
                    <span class="text-purple-500">🕒</span> ${formatTime(control.fecha_creacion)}
                  </h3>
                  <span class="${statusColor} text-grat-600 border px-3 py-1 rounded-full text-xs font-semibold">
                    ${statusText2}
                  </span>
                </div>
  
                <div class="flex justify-between gap-6 flex-wrap mt-3">
                  <div class="flex items-center gap-4 min-w-[140px]">
                      <div class="text-gray-600 text-md">Estado: </div>
                        <div class="${improvedColor} font-semibold flex items-center gap-1">
                            ${improvedStatus}
                        </div>
                      </div>

                  
                  <div class="flex min-w-[140px]">
                    <div class="text-gray-600 text-md mb-1">Probabilidad: </div>
                    <div class="font-semibold text-gray-700 ml-2">
                      ${probability.toFixed(1)}% 
                      <span class="text-gray-600 text-sm">
                        ${statusText.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            `;
                    })
                    .join('');

                return `
          <div class="mb-8">
            <div class=" px-6 py-4 rounded-lg mb-4 border-l-4 border-gray-700 border border-gray-700">
              <h2 class="text-gray-700 font-medium tracking-wide uppercase flex items-center gap-2">
                <span class="text-gray-700 text-xl">📆</span> 
                ${month.toUpperCase()}
              </h2>
            </div>
            ${monthControls}
          </div>
        `;
            }).join('');

            // Contenido final de la página
            const htmlContent = `
        <html>
          <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        </style>
          </head>
          <body class="text-gray-900" style="background-color: #ffffff; font-family: 'Inter', sans-serif;">
        <div class="max-w-3xl mx-auto py-10 px-6">
          <!-- Encabezado -->
        <div class="mb-3 pb-6 border-gray-700">
              <div class="text-center mb-6">
                  <h2 class="text-5xl font-semibold tracking-wider text-teal-700">kawsayar</h2>
                  <p class="text-xl font-semibold text-gray-600 mt-2">Sistema de Alerta contra la Anemia</p>
              </div>

              <div class=" items-center text-gray-600 text-sm">
                  <h5 class="text-xl font-semibold text-gray-700 tracking-wide">Documento: Informe de Controles</h5>
                  <span class="text-lg text-gray-600 ">Generado el ${formattedDate}</span>
              </div>
        </div>

          
          <!-- Información del paciente -->
          ${profileHTML}
          
          <!-- Historial de controles -->
          <div class="mb-6">
            <h2 class="text-xl text-gray-800 font-medium mb-5 pb-3 border-b border-gray-700 gap-3">
            <span class="text-purple-600 text-2xl">📋</span>
            Historial de Controles
            </h2>
            ${controlsHTML}
          </div>
          
          <!-- Pie de página -->
          <div class="text-center mt-10 text-gray-700 text-md font-semibold pt-5 border-t border-gray-700 tracking-wide">
            Sistema de Alerta Contra la Anemia • kawsayar © ${currentDate.getFullYear()}
          </div>
        </div>
          </body>
        </html>
      `;


            // Generar el PDF
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Compartir el archivo PDF generado
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
                alert('PDF exportado correctamente');
            } else {
                alert('No se puede compartir el PDF en este dispositivo');
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Hubo un error al exportar el PDF');
        }
    };

    return (
        <View >
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity style={historialStyles.pdfButton} onPress={exportToPDF}>
                        <MaterialIcons name="picture-as-pdf" size={20} color="#FFF" />
                        <Text style={historialStyles.pdfButtonText}>EXPORTAR PDF</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ExportToPDF;
