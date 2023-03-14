function downloadPdf(pdfUrl, fileName) {
    window.open(pdfUrl, '_blank');
  }
  
// Function to handle PDF save as
function savePdfAs(pdfUrl, pdfTitle) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfTitle;
    document.body.appendChild(link);
  
    // Simulate a click on the link element to start the download
    link.dispatchEvent(new MouseEvent('click'));
  
    // Remove the link element from the document
    document.body.removeChild(link);
  }
  
  // Function to handle PDF printing
  function printPdf(pdfUrl) {
    const printWindow = window.open(pdfUrl, 'Print');
    printWindow.print();
  }

  // Function to render PDF search results
function renderPdfSearchResults(data) {
    const $results = $('#results');
    $results.empty();
  
    data.forEach(pdf => {
      const $card = $('<div class="card">');
  
      const $header = $('<div class="card-header">');
      const $title = $(`<h3 class="card-title">${pdf.title}</h3>`);
      const $author = $(`<span class="author">${pdf.author}</span>`);
      $header.append($title, $author);
  
      const $body = $('<div class="card-body">');
      const $imgLink = $(`<a href="${pdf.url}" target="_blank">`);
      const $img = $('<img src="https://via.placeholder.com/150" alt="${pdf.title}" />');
      $imgLink.append($img);
      const $extractBtn = $(`<button class="btn btn-primary extract-btn" data-pdf-url="${pdf.url}">Extract</button>`);
      const $downloadBtn = $(`<button class="btn btn-secondary download-btn" data-pdf-url="${pdf.url}" data-file-name="${pdf.title}.pdf">Download</button>`);
      const $saveAsBtn = $(`<button class="btn btn-secondary save-as-btn" data-pdf-url="${pdf.url}" data-pdf-title="${pdf.title}.pdf">Save As</button>`);
      const $printBtn = $(`<button class="btn btn-secondary print-btn" data-pdf-url="${pdf.url}">Print</button>`);
      $body.append($imgLink, $extractBtn, $downloadBtn, $saveAsBtn, $printBtn);
  
      $card.append($header, $body);
      $results.append($card);
    });
  }
  
  $(document).ready(() => {
    $('form').submit(e => {
      e.preventDefault();
  
      const fileType = $('#filetype').val();
      const regex = $('#regex').val();
      const keyword = $('#keyword').val();
      const source = [];
      $('input[type=checkbox]:checked').each((i, el) => {
        source.push($(el).val());
      });
  
      $.get('/search', {
        fileType: fileType,
        regex: regex,
        keyword: keyword,
        source: source
      }, data => {
        $('#results').empty();
        data.forEach(pdf => {
          $('#results').append(`
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">${pdf.title}</h3>
                <span class="author">${pdf.author}</span>
              </div>
              <div class="card-body">
                <a href="${pdf.url}" target="_blank">
                  <img src="https://via.placeholder.com/150" alt="${pdf.title}" />
                </a>
                <button class="btn btn-primary extract-btn" data-pdf-url="${pdf.url}">Extract</button>
                <button class="btn btn-secondary download-btn" data-pdf-url="${pdf.url}" data-file-name="${pdf.title}.pdf">Download</button>
                <button class="btn btn-secondary save-as-btn" data-pdf-url="${pdf.url}" data-pdf-title="${pdf.title}.pdf">Save As</button>
                <button class="btn btn-secondary print-btn" data-pdf-url="${pdf.url}">Print</button>
              </div>
            </div>
          `);
        });
      });
    });
  
    $(document).on('click', '.extract-btn', e => {
      e.preventDefault();
  
      const pdfUrl = $(e.currentTarget).data('pdf-url');
  
      // Code to extract PDF data and display options to download, save, or print the PDF
      const pdfDoc = pdfjsLib.getDocument(pdfUrl);
      pdfDoc.promise.then(pdf => {
        pdf.getPage(1).then(page => {
          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext).promise.then(() => {
            const imageData = canvas.toDataURL('image/png');
            const docDefinition = {
              content: [
                {
                  image: imageData,
                  width: 500
                }
              ]
            };
            pdfMake.createPdf(docDefinition).download(`${pdf.title}.pdf`);
          });
        });
      });
    });

    $(document).ready(() => {
        $('form').submit(e => {
          e.preventDefault();
      
          const fileType = $('#filetype').val();
          const regex = $('#regex').val();
          const keyword = $('#keyword').val();
          const source = [];
          $('input[type=checkbox]:checked').each((i, el) => {
            source.push($(el).val());
          });
      
          $.get('/search', {
            fileType,
            regex,
            keyword,
            source
          }, data => {
            const $results = $('#results');
            $results.empty();
      
            data.forEach(pdf => {
              const $card = $('<div class="card">');
      
              const $header = $('<div class="card-header">');
              const $title = $(`<h3 class="card-title">${pdf.title}</h3>`);
              const $author = $(`<span class="author">${pdf.author}</span>`);
              $header.append($title, $author);
      
              const $body = $('<div class="card-body">');
              const $imgLink = $(`<a href="${pdf.url}" target="_blank">`);
              const $img = $('<img src="https://via.placeholder.com/150" alt="${pdf.title}" />');
              $imgLink.append($img);
              const $extractBtn = $(`<button class="btn btn-primary extract-btn" data-pdf-url="${pdf.url}">Extract</button>`);
              const $downloadBtn = $(`<button class="btn btn-secondary download-btn" data-pdf-url="${pdf.url}" data-file-name="${pdf.title}.pdf">Download</button>`);
              const $saveAsBtn = $(`<button class="btn btn-secondary save-as-btn" data-pdf-url="${pdf.url}" data-pdf-title="${pdf.title}.pdf">Save As</button>`);
              const $printBtn = $(`<button class="btn btn-secondary print-btn" data-pdf-url="${pdf.url}">Print</button>`);
              $body.append($imgLink, $extractBtn, $downloadBtn, $saveAsBtn, $printBtn);
      
              $card.append($header, $body);
              $results.append($card);
            });
          });
        });
  

      
      
        $(document).on('click', '.extract-btn', e => {
          e.preventDefault();
      
          const pdfUrl = $(e.currentTarget).data('pdf-url');
      
          // Code to extract PDF data and display options to download, save, or print the PDF
          const pdfDoc = pdfjsLib.getDocument(pdfUrl);
          pdfDoc.promise.then(pdf => {
            pdf.getPage(1).then(page => {
              const viewport = page.getViewport({ scale: 1 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext).promise.then(() => {
                const imageData = canvas.toDataURL('image/png');
                const docDefinition = {
                  content: [
                    {
                      image: imageData,
                      width: 500
                    }
                  ]
                };
                pdfMake.createPdf(docDefinition).download(`${pdf.title}.pdf`);
              });
            });
          });
        });
      
        $(document).on('click', '.download-btn', e => {
          e.preventDefault();
      
          const pdfUrl = $(e.currentTarget).data('pdf-url');
          const fileName = $(e.currentTarget).data('file-name');
      
          downloadPdf(pdfUrl, fileName);
        });
      

        $(document).on('click', '.save-as-btn', e => {
            e.preventDefault();
          
            const pdfUrl = $(e.currentTarget).data('pdf-url');
            const pdfTitle = $(e.currentTarget).data('pdf-title');
          
            savePdfAs(pdfUrl, pdfTitle);
          });
          
          
