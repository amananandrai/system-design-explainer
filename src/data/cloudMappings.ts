import type { CloudProvider, CloudServiceMapping } from "./types";

export const cloudProviders: {
  id: CloudProvider;
  name: string;
  color: string;
  accent: string;
}[] = [
  { id: "generic", name: "Generic", color: "#64748b", accent: "#94a3b8" },
  { id: "aws", name: "AWS", color: "#ff9900", accent: "#ffb84d" },
  { id: "azure", name: "Azure", color: "#0078d4", accent: "#50a0e8" },
  { id: "gcp", name: "GCP", color: "#4285f4", accent: "#669df6" },
];

export const serviceMappings: Record<string, CloudServiceMapping> = {
  mobileClient: {
    generic: "Mobile App",
    aws: "Mobile Client",
    azure: "Mobile App",
    gcp: "Mobile Client",
    description: "Native or cross-platform mobile application",
  },
  webClient: {
    generic: "Web Client",
    aws: "Web Browser",
    azure: "Web App Client",
    gcp: "Web Client",
    description: "Browser or SPA front-end",
  },
  cdn: {
    generic: "CDN",
    aws: "CloudFront",
    azure: "Azure CDN",
    gcp: "Cloud CDN",
    description: "Edge caching and static asset delivery",
  },
  loadBalancer: {
    generic: "Load Balancer",
    aws: "Elastic Load Balancing",
    azure: "Azure Load Balancer",
    gcp: "Cloud Load Balancing",
    description: "Distributes traffic across compute instances",
  },
  apiGateway: {
    generic: "API Gateway",
    aws: "API Gateway",
    azure: "API Management",
    gcp: "Apigee / API Gateway",
    description: "Central entry point for API routing and throttling",
  },
  microservice: {
    generic: "Microservice",
    aws: "ECS / EKS Service",
    azure: "AKS / App Service",
    gcp: "Cloud Run / GKE",
    description: "Independent, domain-focused service",
  },
  serverless: {
    generic: "Serverless Function",
    aws: "AWS Lambda",
    azure: "Azure Functions",
    gcp: "Cloud Functions",
    description: "Event-driven compute without server management",
  },
  objectStorage: {
    generic: "Object Storage",
    aws: "Amazon S3",
    azure: "Azure Blob Storage",
    gcp: "Cloud Storage",
    description: "Durable storage for media, backups, and logs",
  },
  relationalDb: {
    generic: "Relational DB",
    aws: "Amazon RDS",
    azure: "Azure SQL Database",
    gcp: "Cloud SQL",
    description: "Structured transactional data store",
  },
  nosqlDb: {
    generic: "NoSQL Database",
    aws: "DynamoDB",
    azure: "Cosmos DB",
    gcp: "Firestore / Bigtable",
    description: "Horizontally scalable key-value or document store",
  },
  wideColumnDb: {
    generic: "Wide-Column DB",
    aws: "Keyspaces",
    azure: "Cosmos DB (Cassandra API)",
    gcp: "Bigtable",
    description: "High-throughput distributed column store",
  },
  cache: {
    generic: "In-Memory Cache",
    aws: "ElastiCache (Redis)",
    azure: "Azure Cache for Redis",
    gcp: "Memorystore (Redis)",
    description: "Low-latency caching layer",
  },
  messageQueue: {
    generic: "Message Queue",
    aws: "Amazon SQS",
    azure: "Azure Service Bus",
    gcp: "Cloud Pub/Sub",
    description: "Asynchronous task and event buffering",
  },
  streamProcessing: {
    generic: "Stream Processor",
    aws: "Amazon Kinesis",
    azure: "Event Hubs",
    gcp: "Dataflow / Pub/Sub",
    description: "Real-time event ingestion and processing",
  },
  search: {
    generic: "Search Engine",
    aws: "OpenSearch",
    azure: "Azure AI Search",
    gcp: "Vertex AI Search",
    description: "Full-text and faceted search indexing",
  },
  videoTranscoder: {
    generic: "Video Transcoder",
    aws: "Elastic Transcoder / MediaConvert",
    azure: "Azure Media Services",
    gcp: "Transcoder API",
    description: "Converts uploaded video into adaptive streams",
  },
  recommendation: {
    generic: "Recommendation Engine",
    aws: "Personalize",
    azure: "Azure ML",
    gcp: "Recommendations AI",
    description: "ML-driven ranking and personalization",
  },
  auth: {
    generic: "Auth Service",
    aws: "Cognito",
    azure: "Entra ID / B2C",
    gcp: "Identity Platform",
    description: "Authentication, authorization, and session management",
  },
  monitoring: {
    generic: "Observability",
    aws: "CloudWatch",
    azure: "Azure Monitor",
    gcp: "Cloud Monitoring",
    description: "Metrics, logs, traces, and alerting",
  },
  dns: {
    generic: "DNS",
    aws: "Route 53",
    azure: "Azure DNS",
    gcp: "Cloud DNS",
    description: "Domain name resolution and health checks",
  },
  redisProxy: {
    generic: "Redis Proxy",
    aws: "ElastiCache Proxy",
    azure: "Redis Enterprise Proxy",
    gcp: "Memorystore Proxy",
    description: "Connection pooling and request routing to Redis nodes",
  },
  redisPrimary: {
    generic: "Redis Primary",
    aws: "ElastiCache Primary",
    azure: "Redis Primary Node",
    gcp: "Memorystore Primary",
    description: "Master node handling writes",
  },
  redisReplica: {
    generic: "Redis Replica",
    aws: "ElastiCache Replica",
    azure: "Redis Replica Node",
    gcp: "Memorystore Replica",
    description: "Read replica for scaling reads",
  },
  redisSentinel: {
    generic: "Sentinel / Controller",
    aws: "ElastiCache Multi-AZ",
    azure: "Redis Enterprise HA",
    gcp: "Memorystore HA",
    description: "Failover monitoring and cluster orchestration",
  },
  paymentGateway: {
    generic: "Payment Gateway",
    aws: "Payment Cryptography",
    azure: "Payment Services",
    gcp: "Cloud Payments API",
    description: "Secure payment processing integration",
  },
  mapService: {
    generic: "Maps & Routing",
    aws: "Location Service",
    azure: "Azure Maps",
    gcp: "Google Maps Platform",
    description: "Geolocation, routing, and ETA calculations",
  },
};

export function getServiceLabel(
  serviceType: string,
  provider: CloudProvider,
  fallbackLabel: string,
): string {
  const mapping = serviceMappings[serviceType];
  if (!mapping) return fallbackLabel;
  return mapping[provider] ?? mapping.generic;
}

export function getServiceDescription(serviceType: string): string {
  return serviceMappings[serviceType]?.description ?? "";
}

export const categoryColors: Record<string, string> = {
  client: "#6366f1",
  network: "#0ea5e9",
  compute: "#22c55e",
  storage: "#f59e0b",
  database: "#ec4899",
  cache: "#ef4444",
  messaging: "#a855f7",
  analytics: "#14b8a6",
  security: "#64748b",
};
