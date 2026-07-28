import React from "react";

const ColorsPage = () => {
  const colors = [
    // Backgrounds
    { name: "background", class: "bg-background" },
    { name: "background-secondary", class: "bg-background-secondary" },
    { name: "background-tertiary", class: "bg-background-tertiary" },

    // Text Colors
    { name: "foreground", class: "bg-foreground" },
    { name: "foreground-secondary", class: "bg-foreground-secondary" },
    { name: "foreground-tertiary", class: "bg-foreground-tertiary" },

    // Brand
    { name: "primary", class: "bg-primary" },
    { name: "primary-dark", class: "bg-primary-dark" },
    { name: "primary-light", class: "bg-primary-light" },

    // Status
    { name: "success", class: "bg-success" },
    { name: "warning", class: "bg-warning" },
    { name: "danger", class: "bg-danger" },
    { name: "info", class: "bg-info" },

    // Borders
    { name: "border", class: "bg-border" },
    { name: "border-dark", class: "bg-border-dark" },
  ];

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Color Guide</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="bg-background-secondary border border-border rounded-lg overflow-hidden"
            >
              <div className={`h-20 ${color.class}`} />
              <div className="p-3">
                <p className="font-mono text-sm text-foreground">
                  {color.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ColorsPage;
