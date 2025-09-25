#!/usr/bin/env node

/**
 * Bundle Analysis Script for FLUX
 * Analyzes bundle size and provides optimization recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle analysis configuration
const BUNDLE_CONFIG = {
  maxChunkSize: 250, // KB
  maxTotalSize: 1000, // KB
  criticalChunks: ['vendor', 'router', 'bootstrap'],
  analyzeThresholds: {
    warning: 200, // KB
    error: 500 // KB
  }
};

// Analyze bundle files
function analyzeBundle() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dist folder not found. Run "npm run build" first.');
    return;
  }

  const files = fs.readdirSync(distPath);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));
  
  console.log('📊 Bundle Analysis Report');
  console.log('='.repeat(50));
  
  let totalSize = 0;
  const chunkAnalysis = [];
  
  // Analyze JavaScript chunks
  jsFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += parseFloat(sizeKB);
    
    const chunkInfo = {
      name: file,
      size: parseFloat(sizeKB),
      type: 'js'
    };
    
    chunkAnalysis.push(chunkInfo);
    
    // Determine status
    let status = '✅';
    if (parseFloat(sizeKB) > BUNDLE_CONFIG.analyzeThresholds.error) {
      status = '❌';
    } else if (parseFloat(sizeKB) > BUNDLE_CONFIG.analyzeThresholds.warning) {
      status = '⚠️';
    }
    
    console.log(`${status} ${file}: ${sizeKB} KB`);
  });
  
  // Analyze CSS files
  cssFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += parseFloat(sizeKB);
    
    const chunkInfo = {
      name: file,
      size: parseFloat(sizeKB),
      type: 'css'
    };
    
    chunkAnalysis.push(chunkInfo);
    
    console.log(`🎨 ${file}: ${sizeKB} KB`);
  });
  
  console.log('='.repeat(50));
  console.log(`📦 Total Bundle Size: ${totalSize.toFixed(2)} KB`);
  
  // Performance assessment
  if (totalSize > BUNDLE_CONFIG.maxTotalSize) {
    console.log('❌ Bundle size exceeds recommended limit');
  } else if (totalSize > BUNDLE_CONFIG.maxTotalSize * 0.8) {
    console.log('⚠️ Bundle size is approaching limit');
  } else {
    console.log('✅ Bundle size is within recommended limits');
  }
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  
  const largeChunks = chunkAnalysis.filter(chunk => chunk.size > BUNDLE_CONFIG.analyzeThresholds.warning);
  if (largeChunks.length > 0) {
    console.log('🔍 Large chunks detected:');
    largeChunks.forEach(chunk => {
      console.log(`   - ${chunk.name}: ${chunk.size} KB`);
    });
    console.log('   Consider code splitting or lazy loading for these chunks.');
  }
  
  // Check for duplicate dependencies
  console.log('\n🔍 Dependency Analysis:');
  console.log('   - Ensure tree-shaking is enabled for unused code elimination');
  console.log('   - Use dynamic imports for route-based code splitting');
  console.log('   - Consider using lighter alternatives for heavy dependencies');
  
  // Generate optimization report
  generateOptimizationReport(chunkAnalysis, totalSize);
}

// Generate detailed optimization report
function generateOptimizationReport(chunks, totalSize) {
  const report = {
    timestamp: new Date().toISOString(),
    totalSize: totalSize,
    chunks: chunks,
    recommendations: []
  };
  
  // Add specific recommendations based on analysis
  if (totalSize > BUNDLE_CONFIG.maxTotalSize) {
    report.recommendations.push({
      type: 'critical',
      message: 'Bundle size exceeds 1MB. Consider aggressive code splitting.',
      action: 'Implement route-based lazy loading and component-level splitting'
    });
  }
  
  const jsChunks = chunks.filter(c => c.type === 'js');
  const largeJsChunks = jsChunks.filter(c => c.size > BUNDLE_CONFIG.analyzeThresholds.warning);
  
  if (largeJsChunks.length > 0) {
    report.recommendations.push({
      type: 'warning',
      message: `${largeJsChunks.length} JavaScript chunks exceed 200KB`,
      action: 'Split large chunks using dynamic imports or manual chunking'
    });
  }
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'bundle-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Performance budget check
function checkPerformanceBudget() {
  console.log('\n🎯 Performance Budget Check:');
  console.log('   - First Contentful Paint: < 1.5s');
  console.log('   - Largest Contentful Paint: < 2.5s');
  console.log('   - Time to Interactive: < 3.5s');
  console.log('   - Cumulative Layout Shift: < 0.1');
  
  console.log('\n📱 Mobile Performance Tips:');
  console.log('   - Use WebP images with fallbacks');
  console.log('   - Implement service worker for caching');
  console.log('   - Enable compression (gzip/brotli)');
  console.log('   - Use CDN for static assets');
}

// Run the analysis
analyzeBundle();
checkPerformanceBudget();