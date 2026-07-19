// Pool of general devops / IT knowledge questions — 5 are drawn at random
// per interview run. QUESTION_POOL and ANSWER_POOL are index-aligned.

export const QUESTION_POOL: string[] = [
  'What is DNS and how does it work?',
    'Explain the difference between TCP and UDP.',
    'What is the purpose of a VNet (or VPC) in cloud computing?',
    'Describe CI/CD and its benefits.',
    'What is IAM and why is it important in cloud security?',
    'Explain the difference between horizontal and vertical scaling.',
    'What is a load balancer and why is it used?',
    'Describe the concept of Infrastructure as Code (IaC).',
    'What is the difference between symmetric and asymmetric encryption?',
    'Explain what a reverse proxy is and how it differs from a forward proxy.',
    'What is a container and how does it differ from a virtual machine?',
    "Explain what Kubernetes is and why you'd use it.",
    'What is the CAP theorem?',
    'Describe the difference between authentication and authorization.',
    'What is a subnet mask and how is it used in networking?',
    'Explain what a firewall does and the difference between stateful and stateless firewalls.',
    'What is observability and how does it differ from monitoring?',
    'What is a message queue and why would you use one?',
    'Explain what HTTPS is and how the TLS handshake establishes a secure connection.',
    'What is serverless computing (e.g., Azure Functions, AWS Lambda) and what tradeoffs does it involve?',
    'What is the difference between an availability zone and a region in cloud computing?',
    'Explain the difference between blue-green deployments and canary deployments.',
    'What is a VPN and how does it protect network traffic?',
    'Explain the difference between eventual consistency and strong consistency.',
    'What is Docker and what problem does it solve?',
    'What is the difference between a Kubernetes Pod and a Deployment?',
    'What are the three pillars of observability (logs, metrics, and traces), and how do they complement each other?',
    'What is NAT (Network Address Translation) and why is it used?',
    'What is the principle of least privilege and how is it applied in cloud environments?',
    'What is a Terraform state file and why does it matter?',
    'What does it mean for an API operation to be idempotent, and why does that matter?',
    'What is a DDoS attack and what are common mitigation strategies?',
    'What is auto-scaling and what factors go into designing an effective auto-scaling policy?',
    "What is the OSI model and why is it useful even though most real systems don't map to it cleanly?",
    'What is the difference between a rolling deployment and a rollback, and how do they relate?',
    'What is caching and what are the main strategies for cache invalidation?',
     'What is a CDN (Content Delivery Network) and how does it improve performance?',
    'What is the difference between public, private, and hybrid cloud?',
    'What is a service mesh and what problem does it solve?',
    'What is the difference between REST and gRPC?',
    'What is database replication and what is the tradeoff between synchronous and asynchronous replication?',
    'What is the circuit breaker pattern and why is it used in microservices?',
    'What is database sharding (horizontal partitioning) and what challenges does it introduce?',
    'What is a bastion host and why is it used?',
    'How do public and private keys work together in asymmetric cryptography?',
    'What is ARP (Address Resolution Protocol) and what does it do?',
    'What is a health check / liveness probe and why does it matter in a distributed system?',
    'What is the difference between synchronous and asynchronous communication in distributed systems?',
    'What is a Content Security Policy (CSP) and why does it matter for web security?',
    'What is the difference between a monolithic architecture and a microservices architecture?',
    'What is rate limiting and why is it important for APIs?',
    'What is infrastructure drift and how do teams detect or prevent it?',
    'What is a webhook and how does it differ from polling?',
    'What is multi-factor authentication (MFA) and why does it improve security beyond passwords?',
    'What is the principle of defense in depth in security architecture?',
    'What is a Certificate Authority (CA) and how does it fit into the TLS trust chain?',
    'What is the difference between orchestration and automation in DevOps?',
    'What are SLA, SLO, and SLI, and how do they relate to each other?',
    'What is chaos engineering and why do teams practice it?',
    'What is the shared responsibility model in cloud computing?',
];

// ANSWER_POOL is index-aligned with QUESTION_POOL — ANSWER_POOL[i] answers QUESTION_POOL[i].
// Answers are written for a student learning the concept for the first time (2-5 sentences each).

export const ANSWER_POOL: string[] = [
  // What is DNS and how does it work?
  "DNS (Domain Name System) translates human-readable domain names like example.com into IP addresses that computers use to route traffic. When you type a URL, your device queries a DNS resolver, which checks its cache or asks a chain of servers (root, TLD, then authoritative) until it finds the matching IP. This lookup happens in milliseconds and is what lets you use memorable names instead of raw numeric addresses.",

  // Explain the difference between TCP and UDP.
  "TCP is a connection-oriented protocol that guarantees reliable, ordered delivery of data through handshakes, acknowledgments, and retransmission of lost packets. UDP is connectionless and sends packets without guaranteeing delivery or order, which makes it faster but less reliable. TCP is used when accuracy matters, like web pages or file transfers, while UDP suits real-time applications like video streaming or gaming where speed matters more than perfect delivery.",

  // What is the purpose of a VNet (or VPC) in cloud computing?
  "A VNet (Azure) or VPC (AWS) is a logically isolated network within the cloud where you can launch and connect your resources, like VMs and databases. It lets you control IP address ranges, subnets, route tables, and security rules, similar to how you'd design a private network on-premises. This isolation is key for security, since resources inside your VNet aren't exposed to the internet unless you explicitly allow it.",

  // Describe CI/CD and its benefits.
  "CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. CI means developers frequently merge code changes into a shared repository, where automated builds and tests run to catch issues early. CD extends this by automatically preparing (or directly deploying) that tested code to production. Together they reduce manual errors, shorten release cycles, and give teams faster feedback on the quality of their code.",

  // What is IAM and why is it important in cloud security?
  "IAM (Identity and Access Management) is the system that controls who can access what resources in a cloud environment and what actions they're allowed to perform. It uses concepts like users, roles, and policies to enforce granular permissions. IAM is critical because misconfigured access is one of the most common causes of cloud security breaches, so tightly scoping permissions limits the damage if credentials are ever compromised.",

  // Explain the difference between horizontal and vertical scaling.
  "Vertical scaling means adding more resources (CPU, RAM) to a single existing server to handle more load. Horizontal scaling means adding more servers or instances and distributing load across them. Vertical scaling is simpler but has a hard ceiling (you can only make one machine so big), while horizontal scaling is more complex to set up but scales much further and improves fault tolerance since no single machine is a single point of failure.",

  // What is a load balancer and why is it used?
  "A load balancer distributes incoming network traffic across multiple servers so no single server gets overwhelmed. It improves availability and reliability by rerouting traffic away from unhealthy instances, and it enables horizontal scaling since you can add or remove backend servers without disrupting users. Load balancers can operate at different layers, such as distributing HTTP requests (layer 7) or raw TCP connections (layer 4).",

  // Describe the concept of Infrastructure as Code (IaC).
  "Infrastructure as Code means defining and managing infrastructure (servers, networks, databases) through machine-readable configuration files instead of manual setup through a UI. Tools like Terraform or ARM templates let you version-control your infrastructure just like application code, making changes repeatable, auditable, and easy to roll back. This eliminates configuration drift and lets teams spin up identical environments for dev, staging, and production reliably.",

  // What is the difference between symmetric and asymmetric encryption?
  "Symmetric encryption uses a single shared key to both encrypt and decrypt data, making it fast but requiring a secure way to share that key beforehand. Asymmetric encryption uses a key pair, a public key to encrypt and a private key to decrypt, so the public key can be shared openly without compromising security. In practice, systems often combine both: asymmetric encryption to securely exchange a symmetric key, then symmetric encryption for the actual bulk data transfer, since it's more efficient.",

  // Explain what a reverse proxy is and how it differs from a forward proxy.
  "A reverse proxy sits in front of one or more backend servers and forwards client requests to them, hiding the servers' identity and handling tasks like load balancing, SSL termination, and caching. A forward proxy sits in front of clients and forwards their requests out to the internet, often used to hide client identity or enforce access policies. The key difference is which side it protects: a reverse proxy protects servers, a forward proxy protects clients.",

  // What is a container and how does it differ from a virtual machine?
  "A container packages an application with its dependencies into a lightweight, portable unit that shares the host machine's OS kernel. A virtual machine, in contrast, virtualizes an entire hardware stack and runs its own full guest OS, making it heavier and slower to start. Containers are faster to spin up and more resource-efficient, which is why they're popular for microservices, while VMs offer stronger isolation since each one has a completely separate OS.",

  // Explain what Kubernetes is and why you'd use it.
  "Kubernetes is an open-source platform for orchestrating containers at scale, automating tasks like deployment, scaling, load balancing, and self-healing (restarting failed containers). You'd use it when managing many containers across multiple machines becomes too complex to do manually, since Kubernetes handles scheduling workloads onto available nodes and keeping the desired state running. It's especially valuable for microservices architectures that need to scale independently and recover automatically from failures.",

  // What is the CAP theorem?
  "The CAP theorem states that a distributed data system can only guarantee two out of three properties at once: Consistency (every read gets the most recent write), Availability (every request gets a response), and Partition tolerance (the system keeps working despite network failures between nodes). Since network partitions are unavoidable in real distributed systems, in practice this means designers must choose between prioritizing consistency or availability when a partition occurs. This tradeoff shapes decisions like choosing a strongly consistent database versus an eventually consistent one.",

  // Describe the difference between authentication and authorization.
  "Authentication verifies who a user is, typically through credentials like a password, token, or biometric. Authorization determines what an authenticated user is allowed to do, such as which resources they can access or actions they can perform. A simple way to remember it: authentication answers 'who are you?' while authorization answers 'what are you allowed to do?'",

  // What is a subnet mask and how is it used in networking?
  "A subnet mask is a 32-bit number that divides an IP address into a network portion and a host portion, determining which addresses belong to the same local network. For example, a mask of 255.255.255.0 means the first three octets identify the network and the last octet identifies individual hosts. Subnet masks let network administrators split larger networks into smaller subnets, improving organization, security, and efficient use of IP address space.",

  // Explain what a firewall does and the difference between stateful and stateless firewalls.
  "A firewall monitors and controls incoming and outgoing network traffic based on defined security rules, acting as a barrier between trusted and untrusted networks. A stateless firewall evaluates each packet independently against static rules, without knowledge of prior traffic, which is fast but less flexible. A stateful firewall tracks the state of active connections and makes decisions based on the context of the traffic flow, offering stronger security since it can recognize legitimate responses versus unsolicited packets.",

  // What is observability and how does it differ from monitoring?
  "Observability is the ability to understand a system's internal state by examining its external outputs, such as logs, metrics, and traces, especially useful for diagnosing unknown or novel issues. Monitoring is typically about tracking predefined metrics and alerting when they cross known thresholds, answering questions you already knew to ask. Observability goes further, giving you the tools to explore and answer questions you didn't anticipate when something unexpected breaks.",

  // What is a message queue and why would you use one?
  "A message queue is a component that allows different parts of a system to communicate asynchronously by sending messages that are stored until a receiving service processes them. You'd use one to decouple producers and consumers, so they don't need to be available or fast at the same time, and to smooth out traffic spikes by buffering requests. Common examples include RabbitMQ, Azure Service Bus, and AWS SQS, often used in event-driven or microservices architectures.",

  // Explain what HTTPS is and how the TLS handshake establishes a secure connection.
  "HTTPS is HTTP layered on top of TLS (Transport Layer Security), encrypting data exchanged between a client and server so it can't be read or tampered with in transit. The TLS handshake begins with the client and server agreeing on encryption algorithms, then the server presents a certificate to prove its identity, and both sides use asymmetric encryption to securely establish a shared symmetric session key. That symmetric key then encrypts the actual data for the rest of the session, combining the security of asymmetric encryption with the speed of symmetric encryption.",

  // What is serverless computing (e.g., Azure Functions, AWS Lambda) and what tradeoffs does it involve?
  "Serverless computing lets you run code in response to events without provisioning or managing servers yourself; the cloud provider automatically handles scaling and infrastructure. You're typically billed only for actual execution time rather than idle capacity, which can be very cost-effective for sporadic workloads. The tradeoffs include less control over the underlying environment, potential cold-start latency when a function hasn't run recently, and practical limits on execution time and resources per invocation.",

  // What is the difference between an availability zone and a region in cloud computing?
  "A region is a geographic area, like 'East US' or 'West Europe,' containing a cluster of data centers. An availability zone is a physically separate data center (or group of them) within that region, with its own independent power, cooling, and networking. Distributing resources across multiple availability zones within a region protects against a single data center failure, while distributing across regions protects against a larger, geography-wide outage.",

  // Explain the difference between blue-green deployments and canary deployments.
  "Blue-green deployment maintains two identical production environments, 'blue' (current) and 'green' (new), and switches all traffic over to green at once after it's verified, allowing instant rollback by switching back. Canary deployment gradually rolls out the new version to a small subset of users first, monitoring for issues before slowly increasing traffic to the rest. Blue-green favors a clean, fast cutover, while canary favors minimizing risk by catching problems before they affect everyone.",

  // What is a VPN and how does it protect network traffic?
  "A VPN (Virtual Private Network) creates an encrypted tunnel between a device and a remote network over the public internet, making it appear as though the device is directly connected to that private network. It protects traffic by encrypting data so it can't be read by anyone intercepting it along the path, and it can also mask the user's real IP address. VPNs are commonly used to securely connect remote employees to corporate networks or to protect traffic on untrusted public Wi-Fi.",

  // Explain the difference between eventual consistency and strong consistency.
  "Strong consistency guarantees that once a write completes, every subsequent read will return that latest value, no matter which node in the system you query. Eventual consistency guarantees that if no new writes occur, all nodes will eventually converge to the same value, but reads immediately after a write might temporarily return stale data. Strong consistency is safer for things like financial transactions, while eventual consistency often trades some accuracy for better availability and performance, common in large distributed systems.",

  // What is Docker and what problem does it solve?
  "Docker is a platform for building, packaging, and running applications inside containers. It solves the 'it works on my machine' problem by bundling an application with all its dependencies, libraries, and configuration into a single portable image that runs identically across development, testing, and production environments. This consistency, combined with containers' lightweight nature compared to VMs, made Docker central to modern DevOps workflows.",

  // What is the difference between a Kubernetes Pod and a Deployment?
  "A Pod is the smallest deployable unit in Kubernetes, representing one or more tightly coupled containers that share storage and networking. A Deployment is a higher-level resource that manages Pods for you, defining how many replicas should run, handling rolling updates, and automatically recreating Pods if they fail. In short, you rarely create Pods directly in production; you define a Deployment and let Kubernetes manage the underlying Pods to match your desired state.",

  // What are the three pillars of observability (logs, metrics, and traces), and how do they complement each other?
  "Logs are timestamped, detailed records of discrete events, useful for deep-diving into exactly what happened at a specific point. Metrics are numeric measurements over time, like CPU usage or request rate, great for spotting trends and triggering alerts. Traces follow a single request as it moves through multiple services, showing where time is spent and where failures occur in a distributed system. Together they let you first notice a problem (metrics), narrow down where it's happening (traces), and then see exactly why (logs).",

  // What is NAT (Network Address Translation) and why is it used?
  "NAT translates private IP addresses used inside a local network into a single public IP address (or a small pool of them) for communication with the outside internet, and vice versa. It's used because there aren't enough public IPv4 addresses for every device in the world, so NAT lets many devices share one public address. As a side effect, it also adds a layer of security since internal IPs aren't directly exposed to the internet.",

  // What is the principle of least privilege and how is it applied in cloud environments?
  "The principle of least privilege means giving users, applications, or services only the minimum permissions necessary to do their job, and nothing more. In cloud environments, this is applied through IAM roles and policies scoped tightly to specific resources and actions, rather than granting broad admin access by default. Following this principle limits the potential damage if credentials are leaked or an account is compromised, since the attacker's access is constrained.",

  // What is a Terraform state file and why does it matter?
  "A Terraform state file is a JSON file that records the current state of the infrastructure Terraform manages, mapping your configuration to the real resources that exist in the cloud. It matters because Terraform uses this file to determine what changes are needed to bring infrastructure in line with your configuration, comparing desired state against actual state. Because it can contain sensitive data and is critical for correct operation, it's typically stored remotely (like in an Azure Storage account or S3 bucket) with locking to prevent conflicting simultaneous changes.",

  // What does it mean for an API operation to be idempotent, and why does that matter?
  "An idempotent operation produces the same result no matter how many times it's performed, like setting a value to 5, versus a non-idempotent operation like incrementing a value by 1, which changes the outcome each time it runs. This matters in distributed systems because network failures can cause clients to retry requests; if the operation is idempotent, retrying is safe, but if it's not, a retry could cause duplicate effects like double-charging a customer. HTTP methods like GET, PUT, and DELETE are designed to be idempotent, while POST typically is not.",

  // What is a DDoS attack and what are common mitigation strategies?
  "A DDoS (Distributed Denial of Service) attack floods a target system with overwhelming traffic from many sources at once, aiming to exhaust its resources and make it unavailable to legitimate users. Common mitigation strategies include rate limiting, using a CDN or scrubbing service to absorb and filter traffic before it reaches your servers, and auto-scaling to handle traffic spikes. Cloud providers also offer built-in DDoS protection services that detect and mitigate large-scale attacks automatically.",

  // What is auto-scaling and what factors go into designing an effective auto-scaling policy?
  "Auto-scaling automatically adjusts the number of running instances of a resource based on current demand, adding capacity during traffic spikes and removing it during quiet periods to save cost. Designing an effective policy involves choosing the right metrics to trigger scaling (like CPU usage or request queue length), setting sensible thresholds and cooldown periods to avoid rapid flapping, and defining minimum and maximum instance limits. It's also important to consider how quickly new instances can start up, since scaling too slowly can leave a system overwhelmed during sudden traffic surges.",

  // What is the OSI model and why is it useful even though most real systems don't map to it cleanly?
  "The OSI model is a conceptual seven-layer framework (Physical, Data Link, Network, Transport, Session, Presentation, Application) that describes how network communication happens, from raw bits up to the application. Even though real-world protocols like TCP/IP don't map perfectly onto all seven layers, the OSI model is still useful as a shared vocabulary and mental model for troubleshooting, letting engineers pinpoint which 'layer' a problem is occurring at. For example, saying an issue is a 'layer 3 problem' versus a 'layer 7 problem' quickly narrows down whether it's a routing issue or an application-level bug.",

  // What is the difference between a rolling deployment and a rollback, and how do they relate?
  "A rolling deployment gradually replaces instances of the old version of an application with the new version, one batch at a time, so the service stays available throughout. A rollback is the act of reverting to a previous, known-good version after a deployment causes problems, and it can itself often be executed as a rolling deployment in reverse. Together, they form a safety net: rolling deployments minimize risk during release, and rollbacks provide a fast recovery path if something still goes wrong.",

  // What is caching and what are the main strategies for cache invalidation?
  "Caching stores a copy of frequently accessed data in a fast-access location so future requests can be served quicker, reducing load on the underlying data source. The tricky part is cache invalidation, deciding when cached data is stale and needs to be refreshed. Common strategies include time-based expiration (TTL), write-through (updating the cache whenever the source data changes), and manual/event-driven invalidation (explicitly clearing specific cache entries when related data changes).",

  // What is a CDN (Content Delivery Network) and how does it improve performance?
  "A CDN is a geographically distributed network of servers that cache and serve content, like images, videos, or static web assets, from a location physically close to the requesting user. It improves performance by reducing latency, since data doesn't have to travel as far, and it reduces load on the origin server since most requests are served from the cache. CDNs also help absorb traffic spikes and provide some protection against DDoS attacks by distributing the load across many edge locations.",

  // What is the difference between public, private, and hybrid cloud?
  "Public cloud means infrastructure is owned and operated by a third-party provider (like Azure or AWS) and shared among multiple customers over the internet. Private cloud means infrastructure is dedicated entirely to a single organization, either hosted on-premises or by a provider, offering more control and customization. Hybrid cloud combines both, letting organizations keep sensitive workloads private while taking advantage of the public cloud's scalability for other needs, with the two environments integrated together.",

  // What is a service mesh and what problem does it solve?
  "A service mesh is a dedicated infrastructure layer that manages communication between microservices, typically implemented using lightweight proxies (sidecars) deployed alongside each service. It solves the problem of handling cross-cutting concerns, like service discovery, load balancing, retries, encryption, and observability, without embedding that logic into every individual service's code. This lets developers focus on business logic while the mesh (like Istio or Linkerd) handles the complex networking concerns consistently across the whole system.",

  // What is the difference between REST and gRPC?
  "REST is an architectural style built on standard HTTP methods (GET, POST, PUT, DELETE) that typically exchanges data in JSON, making it human-readable and widely compatible. gRPC is a high-performance RPC framework built on HTTP/2 that uses Protocol Buffers, a compact binary format, for faster serialization and supports features like bidirectional streaming. REST tends to be simpler and more universally supported for public-facing APIs, while gRPC is often preferred for internal microservice-to-microservice communication where performance matters.",

  // What is database replication and what is the tradeoff between synchronous and asynchronous replication?
  "Database replication is the process of copying data from a primary database to one or more replica databases, improving availability, read performance, and disaster recovery. Synchronous replication waits for the replica to confirm it received the write before acknowledging success, guaranteeing consistency but adding latency. Asynchronous replication acknowledges the write immediately without waiting for the replica, making it faster but risking a small window where the replica could be slightly behind if the primary fails.",

  // What is the circuit breaker pattern and why is it used in microservices?
  "The circuit breaker pattern monitors calls between services and 'trips' (stops sending requests) after detecting repeated failures, temporarily failing fast instead of letting requests keep hitting a struggling downstream service. After a cooldown period, it allows a few test requests through to check if the service has recovered before fully closing the circuit again. It's used in microservices to prevent cascading failures, where one struggling service could otherwise overwhelm and take down the entire system.",

  // What is database sharding (horizontal partitioning) and what challenges does it introduce?
  "Database sharding splits a large database into smaller, independent pieces called shards, each holding a subset of the data, typically distributed across multiple servers based on a key like user ID. This allows a database to scale beyond what a single machine can handle, both in storage and query throughput. It introduces challenges like more complex queries that span multiple shards, difficulty maintaining transactions across shards, and the risk of uneven data distribution if the sharding key isn't chosen well.",

  // What is a bastion host and why is it used?
  "A bastion host is a hardened server placed in a public-facing subnet that acts as the single controlled entry point for administrators to access resources inside a private network. It's used to minimize the attack surface, since private servers don't need to be directly exposed to the internet; instead, all administrative access is funneled through one tightly monitored and secured machine. This makes it much easier to audit and restrict who can access sensitive internal systems.",

  // How do public and private keys work together in asymmetric cryptography?
  "In asymmetric cryptography, each party has a mathematically linked key pair: a public key that can be shared with anyone, and a private key that must be kept secret. Data encrypted with the public key can only be decrypted with the corresponding private key, which allows anyone to send a message that only the intended recipient can read. The reverse also works for digital signatures: signing with a private key lets anyone verify authenticity using the public key, proving the message really came from that sender.",

  // What is ARP (Address Resolution Protocol) and what does it do?
  "ARP (Address Resolution Protocol) maps an IP address to a physical MAC address on a local network, since devices need the MAC address to actually deliver data at the hardware level. When a device wants to communicate with another device on the same network, it broadcasts an ARP request asking 'who has this IP address?' and the owning device replies with its MAC address. This mapping is then cached temporarily so the lookup doesn't need to repeat for every packet.",

  // What is a health check / liveness probe and why does it matter in a distributed system?
  "A health check (or liveness probe) is a periodic request sent to a service to verify it's running correctly and able to handle traffic. It matters in distributed systems because it allows load balancers or orchestrators like Kubernetes to automatically stop sending traffic to, or even restart, an unhealthy instance without human intervention. Without health checks, a failing instance could silently keep receiving requests and causing errors for users, undetected until someone notices manually.",

  // What is the difference between synchronous and asynchronous communication in distributed systems?
  "Synchronous communication means the caller sends a request and waits (blocks) until it receives a response before continuing, like a typical REST API call. Asynchronous communication means the caller sends a request and continues without waiting, often relying on a callback, event, or message queue to handle the response later. Synchronous communication is simpler to reason about but can create tight coupling and slow the whole system down if one service is slow, while asynchronous communication improves resilience and scalability at the cost of added complexity.",

  // What is a Content Security Policy (CSP) and why does it matter for web security?
  "A Content Security Policy is an HTTP header that tells the browser which sources of content, like scripts, styles, and images, are allowed to load on a webpage. It matters for web security because it's a strong defense against cross-site scripting (XSS) attacks, since even if an attacker manages to inject malicious script into a page, the browser will refuse to execute it if it violates the policy. Properly configuring CSP significantly reduces the impact of many client-side injection vulnerabilities.",

  // What is the difference between a monolithic architecture and a microservices architecture?
  "A monolithic architecture builds an entire application as a single, tightly-coupled codebase and deployment unit, which is simpler to develop and deploy initially but harder to scale or update piece by piece. A microservices architecture breaks the application into small, independently deployable services that each handle a specific business capability and communicate over a network. Microservices offer more flexibility to scale and deploy components independently, but introduce added complexity around networking, data consistency, and operational overhead compared to a monolith.",

  // What is rate limiting and why is it important for APIs?
  "Rate limiting restricts how many requests a client can make to an API within a given time window, such as 100 requests per minute. It's important because it protects the API from being overwhelmed by excessive traffic, whether from a bug, a misbehaving client, or a malicious attack, and it ensures fair usage among all consumers of a shared service. When a client exceeds the limit, the API typically responds with a status like 429 Too Many Requests until the window resets.",

  // What is infrastructure drift and how do teams detect or prevent it?
  "Infrastructure drift happens when the actual state of infrastructure diverges from what's defined in code, usually because someone made a manual change directly in the cloud console instead of through the codified configuration. Teams detect drift by regularly running a 'plan' or 'diff' command (like `terraform plan`) that compares the live infrastructure against the expected state defined in code. They prevent it by enforcing policies that all changes must go through the IaC pipeline, restricting direct manual access to production environments.",

  // What is a webhook and how does it differ from polling?
  "A webhook is a mechanism where a service automatically sends an HTTP request to a specified URL whenever a particular event occurs, essentially pushing data to you in real time. Polling, by contrast, means repeatedly asking a service 'has anything changed yet?' at regular intervals, whether or not anything actually happened. Webhooks are more efficient since they only send data when there's something new, while polling wastes resources on empty checks but doesn't require the calling service to expose a publicly reachable endpoint.",

  // What is multi-factor authentication (MFA) and why does it improve security beyond passwords?
  "Multi-factor authentication requires a user to prove their identity using two or more independent factors, typically something they know (a password), something they have (a phone or hardware token), or something they are (a fingerprint). It improves security beyond passwords alone because even if an attacker steals or guesses a password, they still can't access the account without also possessing the second factor. This makes many common attacks, like phishing or credential stuffing, significantly less effective.",

  // What is the principle of defense in depth in security architecture?
  "Defense in depth is a security strategy that layers multiple independent defensive measures throughout a system, rather than relying on any single point of protection. The idea is that if one layer fails or is bypassed, other layers still stand in the way of an attacker, like combining firewalls, encryption, access controls, monitoring, and employee training. This layered approach significantly reduces the likelihood that a single vulnerability or mistake leads to a full system compromise.",

  // What is a Certificate Authority (CA) and how does it fit into the TLS trust chain?
  "A Certificate Authority is a trusted organization that issues digital certificates, verifying that a public key genuinely belongs to the entity claiming it, like a specific website. In the TLS trust chain, a server presents a certificate signed by a CA, and the client's browser checks whether that CA is in its list of trusted root authorities, following the chain of signatures up to a trusted root. This system allows browsers to trust websites they've never directly verified themselves, relying instead on the CA's vetting process.",

  // What is the difference between orchestration and automation in DevOps?
  "Automation refers to configuring a single task to run without manual intervention, like automatically running tests when code is pushed. Orchestration refers to coordinating multiple automated tasks together into a coherent, end-to-end workflow, managing the order, dependencies, and timing between them, like a full CI/CD pipeline that builds, tests, and deploys in sequence. In short, automation handles individual steps, while orchestration is the conductor that arranges those steps into a complete process.",

  // What are SLA, SLO, and SLI, and how do they relate to each other?
  "An SLI (Service Level Indicator) is a measured metric, like request latency or uptime percentage. An SLO (Service Level Objective) is an internal target for that metric, like '99.9% of requests succeed.' An SLA (Service Level Agreement) is a formal, often contractual, commitment to customers based on those objectives, usually with defined consequences (like service credits) if it's not met. They form a hierarchy: SLIs are measured, SLOs are the internal goals based on those measurements, and SLAs are the external promises built on top.",

  // What is chaos engineering and why do teams practice it?
  "Chaos engineering is the practice of deliberately injecting failures, like shutting down servers or introducing network latency, into a system to test how well it withstands unexpected disruptions. Teams practice it because it's far better to discover weaknesses in a controlled experiment than during a real, unplanned outage at the worst possible time. Tools like Netflix's Chaos Monkey popularized this approach, helping teams build confidence that their systems can gracefully handle real-world failures.",

  // What is the shared responsibility model in cloud computing?
  "The shared responsibility model defines which security and operational tasks are handled by the cloud provider versus the customer. Generally, the provider is responsible for the security 'of' the cloud, like physical data center security and the underlying infrastructure, while the customer is responsible for security 'in' the cloud, like configuring access controls, encrypting their data, and patching their own applications. Understanding where that line falls is critical, since a common cause of cloud breaches is customers assuming the provider handles something that was actually their responsibility.",
];

// looks up the model answer for a given question by matching it against
// QUESTION_POOL (index-aligned with ANSWER_POOL). returns undefined if the
// question text doesn't come from the pool (e.g. a freeform "-q" question).
export const getCorrectAnswer = (questionText: string): string | undefined => {
  const idx = QUESTION_POOL.indexOf(questionText);
  return idx === -1 ? undefined : ANSWER_POOL[idx];
};
