const fs = require('fs');

class ServerGenerator {
  constructor(configPath) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    this.nodes = new Map(this.config.nodes.map(node => [node.id, node]));
  }

  generateImports() {
    return `const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

// Middleware
app.use(express.json());
`;
  }

  generateCorsMiddleware() {
    const corsNode = this.config.nodes.find(node => 
      node.name === "CORS Middleware" && 
      node.properties.type === "middleware"
    );

    if (corsNode) {
      const origins = corsNode.properties.allowed_origins;
      return `app.use(cors({ origin: ${JSON.stringify(origins)} }));\n\n`;
    }
    return '';
  }

  generateAuthMiddleware() {
    return `// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};\n\n`;
  }

  generateRoutes() {
    let routes = '';
    
    this.config.nodes.forEach(node => {
      if (node.properties.endpoint) {
        const method = node.properties.method.toLowerCase();
        const endpoint = node.properties.endpoint;
        const requiresAuth = node.properties.auth_required;
        const isAdmin = node.name.includes('Admin');
        
        let middlewares = [];
        if (requiresAuth) middlewares.push('authMiddleware');
        if (isAdmin) middlewares.push('adminMiddleware');
        
        const middlewareString = middlewares.length ? `, ${middlewares.join(', ')}, ` : ', ';
        
        routes += `app.${method}("${endpoint}"${middlewareString}(req, res) => {
  res.json({ message: "${node.name} response" });
});\n\n`;
      }
    });
    
    return routes;
  }

  generateServer() {
    return `${this.generateImports()}
${this.generateCorsMiddleware()}
${this.generateAuthMiddleware()}
${this.generateRoutes()}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;
  }

  saveToFile(outputPath) {
    fs.writeFileSync(outputPath, this.generateServer());
    console.log(`Server file generated at ${outputPath}`);
  }
}

// Usage
const generator = new ServerGenerator('./server-config.json');
generator.saveToFile('./server.js');