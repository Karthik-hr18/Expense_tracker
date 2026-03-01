function SummaryCard({ title, amount, subtitle, color }) {
    const colorMap = {
        danger: { bg: "linear-gradient(135deg, #ff6b6b, #ee5a24)", text: "#fff" },
        success: { bg: "linear-gradient(135deg, #20c997, #28a745)", text: "#fff" },
        warning: { bg: "linear-gradient(135deg, #f39c12, #e67e22)", text: "#fff" },
        dark: { bg: "linear-gradient(135deg, #636e72, #2d3436)", text: "#fff" },
    };

    const style = colorMap[color] || colorMap["dark"];

    return (
        <div className="summary-card" style={{ background: style.bg }}>
            <div className="summary-card-body">
                <h6 className="summary-card-title">{title}</h6>
                <h4 className="summary-card-amount">
                    ₹ {amount !== undefined && amount !== null ? amount : "—"}
                </h4>
                <small className="summary-card-subtitle">{subtitle || "—"}</small>
            </div>
        </div>
    );
}

export default SummaryCard;