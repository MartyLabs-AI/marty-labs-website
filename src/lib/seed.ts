// This script can be run to seed the database with initial flows
// You can call this from a page or API route during development

export const seedFlows = async () => {
  const flows = [
    {
      id: "ad-banner-resizer",
      title: "Ad Banner Resizer",
      description: "Resize your ad banners to multiple formats (1:1, 9:16, 16:9, 4:5, 21:9) for omnichannel campaigns",
      category: "Marketing",
      tags: ["ads", "banners", "resize", "marketing"],
      inputSchema: {
        type: "object",
        properties: {
          banner: {
            type: "string",
            format: "file",
            accept: "image/*",
            title: "Banner Image",
            description: "Upload your original banner"
          },
          formats: {
            type: "array",
            items: {
              type: "string",
              enum: ["1:1", "9:16", "16:9", "4:5", "21:9"]
            },
            title: "Output Formats",
            description: "Select desired aspect ratios"
          },
          quality: {
            type: "string",
            enum: ["standard", "high", "ultra"],
            default: "high",
            title: "Output Quality"
          }
        },
        required: ["banner", "formats"]
      },
      n8nWorkflowId: "ad-banner-resizer-workflow",
      estimatedProcessingTime: 30,
      creditsPerGeneration: 2,
      requiredPlan: "free",
    },
    {
      id: "product-360-video",
      title: "Product 360° Video",
      description: "Generate rotating 360° videos from a single product image to boost engagement",
      category: "E-commerce",
      tags: ["360", "video", "product", "ecommerce"],
      inputSchema: {
        type: "object",
        properties: {
          productImage: {
            type: "string",
            format: "file",
            accept: "image/*",
            title: "Product Image",
            description: "Upload your product photo"
          },
          background: {
            type: "string",
            enum: ["transparent", "white", "gradient", "custom"],
            default: "transparent",
            title: "Background Style"
          },
          speed: {
            type: "string",
            enum: ["slow", "medium", "fast"],
            default: "medium",
            title: "Rotation Speed"
          },
          duration: {
            type: "number",
            minimum: 3,
            maximum: 10,
            default: 5,
            title: "Video Duration (seconds)"
          }
        },
        required: ["productImage"]
      },
      n8nWorkflowId: "product-360-video-workflow",
      estimatedProcessingTime: 60,
      creditsPerGeneration: 5,
      requiredPlan: "free",
    },
    {
      id: "poster-generator",
      title: "AI Poster Generator",
      description: "Create stunning posters from text prompts using multiple AI models for creative exploration",
      category: "Design",
      tags: ["poster", "design", "ai", "creative"],
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            title: "Creative Prompt",
            description: "Describe the poster you want to create"
          },
          style: {
            type: "string",
            enum: ["modern", "vintage", "minimalist", "bold", "artistic"],
            default: "modern",
            title: "Design Style"
          },
          size: {
            type: "string",
            enum: ["A4", "letter", "24x36", "18x24", "square"],
            default: "A4",
            title: "Poster Size"
          },
          colorScheme: {
            type: "string",
            enum: ["vibrant", "monochrome", "pastel", "dark", "custom"],
            default: "vibrant",
            title: "Color Scheme"
          }
        },
        required: ["prompt"]
      },
      n8nWorkflowId: "poster-generator-workflow",
      estimatedProcessingTime: 45,
      creditsPerGeneration: 3,
      requiredPlan: "pro",
    },
    {
      id: "testimonial-card-maker",
      title: "Testimonial Card Maker",
      description: "Transform customer reviews into beautiful, branded testimonial cards for social media",
      category: "Social",
      tags: ["testimonial", "review", "social media", "branding"],
      inputSchema: {
        type: "object",
        properties: {
          testimonialText: {
            type: "string",
            title: "Testimonial Text",
            description: "Enter the customer review or testimonial"
          },
          customerName: {
            type: "string",
            title: "Customer Name",
            description: "Name of the person giving the testimonial"
          },
          customerTitle: {
            type: "string",
            title: "Customer Title/Company",
            description: "Optional: Customer's title or company"
          },
          cardStyle: {
            type: "string",
            enum: ["clean", "corporate", "creative", "minimal"],
            default: "clean",
            title: "Card Style"
          },
          brandColors: {
            type: "string",
            enum: ["blue", "green", "purple", "orange", "custom"],
            default: "blue",
            title: "Brand Color Theme"
          }
        },
        required: ["testimonialText", "customerName"]
      },
      n8nWorkflowId: "testimonial-card-workflow",
      estimatedProcessingTime: 20,
      creditsPerGeneration: 2,
      requiredPlan: "free",
    },
    {
      id: "product-grid-generator",
      title: "Product Grid Generator",
      description: "Create product showcase grids with multiple styles and contexts from a single product image",
      category: "E-commerce",
      tags: ["product", "grid", "showcase", "ecommerce"],
      inputSchema: {
        type: "object",
        properties: {
          productImage: {
            type: "string",
            format: "file",
            accept: "image/*",
            title: "Product Image",
            description: "Upload your product photo"
          },
          gridSize: {
            type: "string",
            enum: ["2x2", "3x3", "2x3", "4x4"],
            default: "3x3",
            title: "Grid Layout"
          },
          contexts: {
            type: "array",
            items: {
              type: "string",
              enum: ["lifestyle", "studio", "outdoor", "minimal", "luxury", "vintage"]
            },
            title: "Product Contexts",
            description: "Choose contexts for product variations"
          },
          outputFormat: {
            type: "string",
            enum: ["square", "portrait", "landscape"],
            default: "square",
            title: "Output Format"
          }
        },
        required: ["productImage", "contexts"]
      },
      n8nWorkflowId: "product-grid-workflow",
      estimatedProcessingTime: 90,
      creditsPerGeneration: 8,
      requiredPlan: "business",
    }
  ];

  // TODO: Call Convex mutation to seed flows
  // This would typically be done through a Convex mutation
  console.log("Seeding flows:", flows);
  return flows;
};