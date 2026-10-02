# Deal Registration Portal: Dynamic Schema Validation and Multi-API Concurrent Failover Engine

**Author:** Henri Mafra  
**License:** MIT License  
**Domain:** Enterprise Application Integration, State Machine Workflows, Resilient Distributed Systems  

---

## 1. Overview

Deal Registration Portal is a multi-step enterprise qualification and deal registration platform designed for value-added resellers, system integrators, and OEM technology manufacturers (e.g., Qualys, Fortinet, Netskope, HPE/Aruba). The platform features dynamic conditional form schemas and a **concurrent 5-way API failover subsystem** for corporate registry verification.

---

## 2. Concurrent Multi-API Failover Model

To ensure sub-500ms corporate entity resolution during public buyer registry lookup, the system initiates simultaneous asynchronous queries across multiple upstream providers:

$$R = \text{Promise.any}\left([A_1(q), A_2(q), A_3(q), A_4(q), A_5(q)]\right)$$

Upstream providers include BrasilAPI, Minha Receita, CNPJ.ws, ReceitaWS, and an internal PostgreSQL cache tier. The fastest valid resolution populates the corporate profile, canceling slower requests via `AbortController` signals to prevent connection pool exhaustion.

---

## 3. Dynamic Conditional Schema Architecture

The qualification pipeline executes across a deterministic three-stage state machine:

1. **Stage 1 (Entity & Notice Qualification):** Public agency CNPJ verification, tender process numbering, bidding modality selection, and legal session date validation.
2. **Stage 2 (OEM Technical Dimensions):** Renders dynamic conditional fieldsets:
   - **Vulnerability Management (VMDR):** License volumes, agent quantities, patch management modules.
   - **Network Security (NGFW):** Firewall throughput, appliance models, high-availability configurations.
   - **Cloud Security (SASE/ZTNA):** Tenant URLs, inline CASB user counts, private access connector nodes.
3. **Stage 3 (Distribution & Submission):** Commercial margin targets, authorized distributor selection, and compliance attestations.

---

## 4. Setup and Execution

```bash
# 1. Clone repository
git clone https://github.com/HenriMafra/deal-registration-portal.git
cd deal-registration-portal

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Start local development server
npm run dev
```

---

## 5. References

- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
- Newman, S. (2021). *Building Microservices: Designing Fine-Grained Systems* (2nd ed.). O'Reilly Media.

---

## 6. License

Licensed under the MIT License. Copyright (c) Henri Mafra.
