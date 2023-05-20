import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { imageData } from "../../data/logoDataURL";
import { signImageData } from "../../data/signDataURL";

const PDFGenerator = ({name, age, gender, selectedDoc}, prescription) => {
    const pdf = new jsPDF("p", "pt", "a4");
    let y = 50;
    
    pdf.addImage(imageData, 'PNG', 40, 0, 140, 140);
    
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(25);
    pdf.setTextColor(74, 76, 178);
    
    pdf.text("MEDICALL", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("MEDICALL") * pdf.internal.getFontSize())), y);
    y += 30;
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(15);
    pdf.setTextColor(0, 0, 0);
    
    pdf.text("Mumbai, India", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("Mumbai, India") * pdf.internal.getFontSize())), y);
    y += 20;
    pdf.text("+91 12345 67890", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("+91 12345 67890") * pdf.internal.getFontSize())), y);
    y += 20;
    pdf.text("medicall@gmail.com", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("medicall@gmail.com") * pdf.internal.getFontSize())), y);
    y += 25;
    
    pdf.setFillColor(74, 76, 178);
    pdf.setDrawColor(74, 76, 178);
    pdf.rect(40, y, 515, 5, "FD");
    
    y += 50;
    pdf.setFontSize(15);
    const d = new Date();
    const date = (d.getDate() < 10? '0' + d.getDate() : d.getDate()) + '/' + (d.getMonth() < 10? '0' + d.getMonth() : d.getMonth()) + '/' + d.getFullYear();
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Name: ", 40, y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(name, 45 + pdf.getStringUnitWidth("Name: ") * pdf.internal.getFontSize(), y);
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Age: ", 275, y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(age, 280 + pdf.getStringUnitWidth("Age: ") * pdf.internal.getFontSize(), y);
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Gender: ", pdf.internal.pageSize.width - 45 - pdf.getStringUnitWidth(`Gender: ${gender}`) * pdf.internal.getFontSize(), y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(gender, pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth(gender) * pdf.internal.getFontSize(), y);
    
    y += 30
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Consulted By: ", 40, y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(selectedDoc, 45 + pdf.getStringUnitWidth("Consulted By: ") * pdf.internal.getFontSize(), y);
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Date: ", pdf.internal.pageSize.width - 45 - pdf.getStringUnitWidth(`Date: ${date}`) * pdf.internal.getFontSize(), y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(date, pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth(date) * pdf.internal.getFontSize(), y);
    
    y += 50;
    
    const totalCost = 350;
    
    pdf.setFont("Times New Roman", "bold");
    pdf.setDrawColor(0, 0, 0);
    pdf.text("Prescription", pdf.internal.pageSize.width/2 - (pdf.getStringUnitWidth("Prescription")/2) * (pdf.internal.getFontSize()/2), y);
    pdf.line(pdf.internal.pageSize.width/2 - (pdf.getStringUnitWidth(`Prescription`)/2) * (pdf.internal.getFontSize()/2), y+5, pdf.internal.pageSize.width/2 - (pdf.getStringUnitWidth(`Prescription`)/2) * (pdf.internal.getFontSize()/2) + 80, y+5);
    y += 15;
    
    pdf.autoTable({
        head: [["SrNo", "Medicine", "Dosage (Morning-Afternoon-Night)", "Duration"]],
        body: [...prescription.map((item, index) => [index+1, ...item.split(" | ")])],
        startY: y,
        headStyles: {
        valign: "middle",
        halign: "center",
        fontSize: 13
        },
        bodyStyles: {
        valign: "middle",
        halign: "center",
        fontSize: 12
        }
    });
    
    y += (30 * prescription.length) + 40;
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Fee Details", pdf.internal.pageSize.width/2 - (pdf.getStringUnitWidth("Fee Details")/2) * (pdf.internal.getFontSize()/2), y);
    pdf.line(pdf.internal.pageSize.width/2 - (pdf.getStringUnitWidth(`Fee Details`)/2) * (pdf.internal.getFontSize()/2), y+5, pdf.internal.pageSize.width/2 - (pdf.getStringUnitWidth(`Fee Details`)/2) * (pdf.internal.getFontSize()/2) + 72, y+5);
    y += 15;
    
    pdf.autoTable({
        head: [["SrNo", "Name", "Cost (in Rs.)"]],
        body: [[1,"Consultation Fee", 150], [2,"Doctor Fee", 200]],
        startY: y,
        headStyles: {
        valign: "middle",
        halign: "center",
        fontSize: 13
        },
        bodyStyles: {
        valign: "middle",
        halign: "center",
        fontSize: 12
        }
    });
    
    y += (30 * 2) + 45;
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Total Cost: ", pdf.internal.pageSize.width - 45 - pdf.getStringUnitWidth(`Total Cost: Rs. ${totalCost}`) * pdf.internal.getFontSize(), y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(`Rs. ${totalCost}`, pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth(`Rs. ${totalCost}`) * pdf.internal.getFontSize(), y);
    y += 50;
    
    pdf.setFont("Times New Roman", "bold");
    pdf.setFontSize(13);
    pdf.text("NOTE: ", 40, y);
    pdf.setFont("Times New Roman", "italic");
    pdf.text('The cost for the medicines in the prescription is not given as the patient have to buy these', 45 + pdf.getStringUnitWidth("NOTE: ") * pdf.internal.getFontSize(), y);
    y += 18;
    pdf.text("medicines from the medical store. You can purchase these medicines from the given link: ", 40, y);
    y += 18;
    pdf.text("https://gfg-sfi.onrender.com/buy-medicines.", 40, y);
    
    y += 60;
    pdf.setFont("Times New Roman", "bold");
    pdf.setFontSize(15);
    pdf.text("Signature: ", 40, y);
    
    pdf.addImage(signImageData, 50 + pdf.getStringUnitWidth("Signature: ") * pdf.internal.getFontSize(), y - 33, 150, 47);
    
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(150);
    pdf.text("2023 @Medicall | All Rights Reserved", pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth("2023 @MediCall | All Rights Reserved") * pdf.internal.getFontSize(), pdf.internal.pageSize.height - 30);

    return pdf;
}

export default PDFGenerator;