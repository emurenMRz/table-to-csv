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
						const content = formatTableData(tableData.data, format);
						downloadFile(content, `table_data_${index + 1}.${format}`);
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
		const data = [];
		let isEmptyTable = true;
		let header = [];
		rows.forEach((row, rowIndex) => {
			const cells = row.querySelectorAll("th, td");
			const cellData = [];
			cells.forEach((cell) => {
				let cellText = cell.innerText.trim();
				if (cellText) isEmptyTable = false;
				cellData.push(cellText);
			});
			if (rowIndex === 0) header = cellData;
			data.push(cellData);
		});
		if (!isEmptyTable) tableData.push({ header, data });
	});
	return tableData;
}

function formatTableData(data, format) {
	const delimiter = format === "csv" ? "," : "\t";
	return data.map(row => row.map(cell => {
		if (format === "csv" && cell.includes(",")) {
			return `"${cell}"`;
		}
		return cell;
	}).join(delimiter)).join("\n");
}

function downloadFile(content, filename) {
	const blob = new Blob([content], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
