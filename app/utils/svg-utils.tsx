import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

interface SvgIconProps {
  source: any; // Accept require() result
  width?: number;
  height?: number;
  color?: string;
}

// Cache for loaded SVG content
const svgCache: Record<string, string> = {};

export function SvgIcon({ source, width = 24, height = 24, color = '#716666' }: SvgIconProps) {
  const [xml, setXml] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    async function loadSvg() {
      try {
        // Check if we have this SVG in cache
        const sourceUri = source.uri || source;
        if (svgCache[sourceUri]) {
          setXml(svgCache[sourceUri]);
          return;
        }
        
        // Load the SVG file
        const asset = Asset.fromModule(source);
        await asset.downloadAsync();
        
        if (asset.localUri) {
          const content = await FileSystem.readAsStringAsync(asset.localUri);
          // Replace colors
          const coloredXml = content
            .replace(/fill="[^"]*"/g, `fill="${color}"`)
            .replace(/fill:#[^;"]*/g, `fill:${color}`)
            .replace(/currentColor/g, color);
          
          // Cache the result
          svgCache[sourceUri] = coloredXml;
          setXml(coloredXml);
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    }
    
    loadSvg();
  }, [source, color]);
  
  if (!xml) {
    return null; // Or a placeholder
  }
  
  return <SvgXml xml={xml} width={width} height={height} />;
}

// SVG files
export const ICONS = {
  settings: require('../../assets/icons/settings-icon.svg'),
  calendar: require('../../assets/icons/calendar.svg'),
}; 