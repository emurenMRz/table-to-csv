document.addEventListener("DOMContentLoaded", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			func: extractTables,
		}, (results) => {
			if (results && results[0] && results[0].result) {
				const buttonsContainer = document.getElementById("buttonsContainer");
				const formatSwitch = document.querySelectorAll('input[name="format"]');
				let format = "csv";
				formatSwitch.forEach((radio) => {
					radio.addEventListener("change", (event) => {
						format = event.target.value;
					});
				});
				results[0].result.forEach((tableData, index) => {
					const button = document.createElement("button");
					const label = tableData.header.find(text => text.trim() !== "") || `Table ${index + 1}`;
					button.textContent = `Download ${label}`;
					button.addEventListener("click", () => {
						const content = format === "csv" ? tableData.csvContent : tableData.tsvContent;
						downloadCsv(content, `table_data_${index + 1}.${format}`);
					});
					buttonsContainer.appendChild(button);
				});
			}
		});
	});
});

function extractTables() {
	const tables = document.querySelectorAll("table");
	const tableData = [];
	tables.forEach((table) => {
		if (table.querySelector("table")) return;

		const rows = table.querySelectorAll("tr");
		const rowData = [];
		const rowDataTsv = [];
		let isEmptyTable = true;
		let header = [];
		rows.forEach((row, rowIndex) => {
			const cells = row.querySelectorAll("th, td");
			const cellData = [];
			cells.forEach((cell) => {
				let cellText = cell.innerText.trim();
				if (cellText) isEmptyTable = false;
				if (cellText.includes(",")) cellText = `"${cellText}"`;
				cellData.push(cellText);
			});
			if (rowIndex === 0) header = cellData;
			rowData.push(cellData.join(","));
			rowDataTsv.push(cellData.join("\t"));
		});
		if (!isEmptyTable) tableData.push({ header, csvContent: rowData.join("\n"), tsvContent: rowDataTsv.join("\n") });
	});
	return tableData;
}

function downloadCsv(csvContent, filename) {
	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
