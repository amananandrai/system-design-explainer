export type CloudProvider = "aws" | "azure" | "gcp";

export type ComponentType =
  | "cdn"
  | "load-balancer"
  | "api-gateway"
  | "compute"
  | "database"
  | "cache"
  | "message-queue"
  | "object-storage"
  | "search"
  | "stream-processing"
  | "dns"
  | "monitoring"
  | "auth"
  | "ml"
  | "analytics";

export interface CloudService {
  name: string;
  shortName: string;
}

export interface ProviderConfig {
  id: CloudProvider;
  name: string;
  color: string;
  accent: string;
  services: Record<ComponentType, CloudService>;
}

export const CLOUD_PROVIDERS: Record<CloudProvider, ProviderConfig> = {
  aws: {
    id: "aws",
    name: "Amazon Web Services",
    color: "#FF9900",
    accent: "#232F3E",
    services: {
      cdn: { name: "Amazon CloudFront", shortName: "CloudFront" },
      "load-balancer": { name: "Elastic Load Balancing", shortName: "ELB" },
      "api-gateway": { name: "Amazon API Gateway", shortName: "API Gateway" },
      compute: { name: "Amazon EC2 / ECS", shortName: "EC2/ECS" },
      database: { name: "Amazon RDS / DynamoDB", shortName: "RDS/DynamoDB" },
      cache: { name: "Amazon ElastiCache", shortName: "ElastiCache" },
      "message-queue": { name: "Amazon SQS / SNS", shortName: "SQS/SNS" },
      "object-storage": { name: "Amazon S3", shortName: "S3" },
      search: { name: "Amazon OpenSearch", shortName: "OpenSearch" },
      "stream-processing": { name: "Amazon Kinesis", shortName: "Kinesis" },
      dns: { name: "Amazon Route 53", shortName: "Route 53" },
      monitoring: { name: "Amazon CloudWatch", shortName: "CloudWatch" },
      auth: { name: "Amazon Cognito", shortName: "Cognito" },
      ml: { name: "Amazon SageMaker", shortName: "SageMaker" },
      analytics: { name: "Amazon Redshift", shortName: "Redshift" },
    },
  },
  azure: {
    id: "azure",
    name: "Microsoft Azure",
    color: "#0078D4",
    accent: "#003B6F",
    services: {
      cdn: { name: "Azure Front Door / CDN", shortName: "Front Door" },
      "load-balancer": { name: "Azure Load Balancer", shortName: "Load Balancer" },
      "api-gateway": { name: "Azure API Management", shortName: "API Mgmt" },
      compute: { name: "Azure Virtual Machines / AKS", shortName: "VM/AKS" },
      database: { name: "Azure SQL / Cosmos DB", shortName: "SQL/Cosmos" },
      cache: { name: "Azure Cache for Redis", shortName: "Azure Redis" },
      "message-queue": { name: "Azure Service Bus", shortName: "Service Bus" },
      "object-storage": { name: "Azure Blob Storage", shortName: "Blob Storage" },
      search: { name: "Azure Cognitive Search", shortName: "Cog. Search" },
      "stream-processing": { name: "Azure Event Hubs", shortName: "Event Hubs" },
      dns: { name: "Azure DNS", shortName: "Azure DNS" },
      monitoring: { name: "Azure Monitor", shortName: "Monitor" },
      auth: { name: "Azure Active Directory", shortName: "Entra ID" },
      ml: { name: "Azure Machine Learning", shortName: "Azure ML" },
      analytics: { name: "Azure Synapse Analytics", shortName: "Synapse" },
    },
  },
  gcp: {
    id: "gcp",
    name: "Google Cloud Platform",
    color: "#4285F4",
    accent: "#1A73E8",
    services: {
      cdn: { name: "Cloud CDN", shortName: "Cloud CDN" },
      "load-balancer": { name: "Cloud Load Balancing", shortName: "Cloud LB" },
      "api-gateway": { name: "Apigee / Cloud Endpoints", shortName: "Apigee" },
      compute: { name: "Compute Engine / GKE", shortName: "GCE/GKE" },
      database: { name: "Cloud SQL / Spanner", shortName: "SQL/Spanner" },
      cache: { name: "Memorystore for Redis", shortName: "Memorystore" },
      "message-queue": { name: "Cloud Pub/Sub", shortName: "Pub/Sub" },
      "object-storage": { name: "Cloud Storage", shortName: "GCS" },
      search: { name: "Vertex AI Search", shortName: "AI Search" },
      "stream-processing": { name: "Dataflow / Pub/Sub", shortName: "Dataflow" },
      dns: { name: "Cloud DNS", shortName: "Cloud DNS" },
      monitoring: { name: "Cloud Monitoring", shortName: "Monitoring" },
      auth: { name: "Identity Platform", shortName: "Identity" },
      ml: { name: "Vertex AI", shortName: "Vertex AI" },
      analytics: { name: "BigQuery", shortName: "BigQuery" },
    },
  },
};

export const COMPONENT_ICONS: Record<ComponentType, string> = {
  cdn: "🌐",
  "load-balancer": "⚖️",
  "api-gateway": "🚪",
  compute: "⚙️",
  database: "🗄️",
  cache: "⚡",
  "message-queue": "📨",
  "object-storage": "📦",
  search: "🔍",
  "stream-processing": "🌊",
  dns: "🔗",
  monitoring: "📊",
  auth: "🔐",
  ml: "🤖",
  analytics: "📈",
};
