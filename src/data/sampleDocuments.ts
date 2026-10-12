export interface SampleDocument {
  id: string;
  name: string;
  type: string;
  description: string;
  pageCount: number;
  text: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "sample-nda",
    name: "Mutual_Non_Disclosure_Agreement_Nexora.txt",
    type: "Non-Disclosure Agreement (NDA)",
    description: "Standard bilateral confidentiality agreement between two technology firms with IP protection, 3-year survival, and Delaware governing law.",
    pageCount: 3,
    text: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of October 1, 2026 (the "Effective Date"), by and between:

Party A: Nexora Technologies Inc., a Delaware corporation with its principal place of business at 450 Mission Street, Suite 800, San Francisco, CA 94105 ("Nexora"), and
Party B: Horizon Cloud Dynamics LLC, a Texas limited liability company with its principal place of business at 1200 Congress Avenue, Austin, TX 78701 ("Horizon").

Nexora and Horizon may collectively be referred to as the "Parties," or individually as a "Party."

RECITALS
WHEREAS, the Parties desire to explore potential joint engineering collaboration and strategic software integration opportunities (the "Authorized Purpose"); and
WHEREAS, in connection with the Authorized Purpose, each Party may disclose to the other certain non-public, proprietary, or confidential technical, operational, and business information.

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any and all non-public information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party"), whether orally, in writing, electronically, or by inspection of tangible objects, that is designated as "Confidential," "Proprietary," or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation: source code, software architecture, algorithm specifications, customer lists, pricing strategies, financial statements, and product roadmaps.

2. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that:
(a) is or becomes publicly known through no breach of this Agreement by the Receiving Party;
(b) was already in the rightful possession of the Receiving Party prior to disclosure without an obligation of confidentiality;
(c) is independently developed by the Receiving Party without reference to or reliance upon the Disclosing Party's Confidential Information; or
(d) is lawfully obtained from a third party without breach of any confidentiality obligation.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
(a) protect the Disclosing Party's Confidential Information with at least the same degree of care used to protect its own confidential information of like importance, but in no event less than a reasonable degree of care;
(b) restrict disclosure of Confidential Information solely to its employees, contractors, and legal advisors who have a strict need to know for the Authorized Purpose and who are bound by written confidentiality obligations at least as restrictive as those herein; and
(c) refrain from copying, reverse engineering, decompiling, or disassembling any software or prototypes provided under this Agreement.

4. TERM AND SURVIVAL
This Agreement shall commence on the Effective Date and continue for a period of one (1) year. The obligations of confidentiality and non-use with respect to Confidential Information disclosed during the term shall survive termination or expiration of this Agreement for a period of three (3) years from the date of disclosure; provided, however, that trade secrets shall remain confidential for as long as they qualify as trade secrets under applicable law.

5. RETURN OR DESTRUCTION OF MATERIALS
Upon written request of the Disclosing Party, or upon termination of discussions between the Parties, the Receiving Party shall promptly, and in any event within fourteen (14) days, return or certify the permanent destruction of all copies of Confidential Information, retaining only one archival copy strictly for compliance and regulatory record-keeping.

6. REMEDIES AND INJUNCTIVE RELIEF
The Parties acknowledge that any breach or threatened breach of this Agreement may cause irreparable harm for which monetary damages alone would be inadequate. Accordingly, in the event of any such breach, the Disclosing Party shall be entitled to seek equitable relief, including temporary restraining orders and preliminary injunctions, without necessity of posting bond or proving actual monetary damages.

7. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute arising under or relating to this Agreement shall be submitted to binding arbitration administered by the American Arbitration Association (AAA) in Wilmington, Delaware, under its Commercial Arbitration Rules.

8. MISCELLANEOUS
This Agreement constitutes the entire understanding between the Parties concerning the subject matter hereof and supersedes all prior agreements. No amendment shall be effective unless in writing and signed by authorized representatives of both Parties. Neither Party acquires any intellectual property license under this Agreement.

IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement as of the Effective Date.

NEXORA TECHNOLOGIES INC.
By: /s/ Elena Vance
Name: Elena Vance
Title: Chief Executive Officer

HORIZON CLOUD DYNAMICS LLC
By: /s/ Marcus Chen
Name: Marcus Chen
Title: Managing Director`,
  },
  {
    id: "sample-saas",
    name: "Master_SaaS_Subscription_Agreement_CloudPulse.txt",
    type: "SaaS Master Services Agreement (MSA)",
    description: "Enterprise software-as-a-service agreement with SLA guarantees, payment schedules, liability caps, automatic renewals, and data protection provisions.",
    pageCount: 4,
    text: `MASTER SAAS SUBSCRIPTION AND SERVICES AGREEMENT

This Master SaaS Subscription Agreement (the "Agreement") is dated as of September 15, 2026, by and between:

PROVIDER: CloudPulse Systems Inc., a California corporation with offices at 100 Montgomery Street, San Francisco, CA 94104 ("Provider"), and
CUSTOMER: Apex Global Logistics Corp., a Delaware corporation with offices at 500 West Madison Street, Chicago, IL 60661 ("Customer").

1. SUBSCRIPTION SERVICES AND ACCESS
Provider grants Customer a non-exclusive, non-transferable, worldwide right to access and use the CloudPulse Enterprise Platform (the "Service") during the Subscription Term solely for Customer's internal logistics operations in accordance with the Documentation and applicable Order Form.

2. SERVICE LEVEL AGREEMENT (SLA) & UPTIME
Provider warrants that the Service will achieve a Monthly Uptime Percentage of at least 99.9% during each billing cycle, excluding scheduled maintenance windows occurring between 1:00 AM and 3:00 AM Pacific Time on Sundays. If Provider fails to meet the 99.9% uptime commitment, Customer's sole and exclusive remedy shall be to receive a Service Credit equal to 5% of the monthly subscription fee for every 0.5% downtime below 99.9%, capped at a maximum of 25% of the applicable monthly fee.

3. FEES, PAYMENT SCHEDULE AND TAXES
3.1 Subscription Fees: Customer shall pay the annual subscription fee of $48,000 USD, billed quarterly in advance ($12,000 USD per quarter).
3.2 Invoicing and Due Date: Invoices are payable within thirty (30) days from the invoice date (Net 30).
3.3 Late Penalties: Unpaid amounts shall accrue interest at the rate of 1.5% per month, or the maximum rate permitted by law, whichever is less, compounded monthly from the date due until paid in full.
3.4 Taxes: Fees are exclusive of all applicable federal, state, and local sales, value-added, or withholding taxes, which shall be the sole responsibility of Customer.

4. INTELLECTUAL PROPERTY RIGHTS
Provider retains all right, title, and interest, including all patent, copyright, trademark, and trade secret rights, in and to the Service, underlying software, APIs, and Documentation. Customer retains all ownership of Customer Data uploaded to or processed by the Service. Customer grants Provider a limited, revocable license to process Customer Data strictly to provide and maintain the Service.

5. DATA SECURITY AND PRIVACY
Provider shall maintain industry-standard administrative, physical, and technical safeguards designed to protect Customer Data against unauthorized access, loss, or alteration, including SOC 2 Type II compliance and AES-256 encryption at rest and in transit.

6. LIMITATION OF LIABILITY
6.1 EXCLUSION OF CONSEQUENTIAL DAMAGES: IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION.
6.2 AGGREGATE LIABILITY CAP: EXCEPT FOR BREACHES OF CONFIDENTIALITY UNDER SECTION 7 OR WILLFUL MISCONDUCT, EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.

7. TERM, AUTOMATIC RENEWAL, AND TERMINATION
7.1 Term: The initial subscription term is twelve (12) months starting on October 1, 2026.
7.2 Automatic Renewal: THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE TWELVE (12) MONTH TERMS UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE OF NON-RENEWAL AT LEAST SIXTY (60) CALENDAR DAYS PRIOR TO THE EXPIRATION OF THE THEN-CURRENT TERM. Provider reserves the right to increase annual subscription fees by up to 5% upon each annual renewal upon giving ninety (90) days advance notice.
7.3 Termination for Cause: Either Party may terminate this Agreement immediately upon written notice if the other Party:
(a) commits a material breach and fails to cure such breach within thirty (30) days of receiving written notice specifying the breach; or
(b) becomes insolvent, enters receivership, or files for bankruptcy protection.

8. INDEMNIFICATION
Provider shall defend, indemnify, and hold harmless Customer against any third-party claim alleging that the Service infringes any valid United States patent or copyright, provided Customer gives prompt written notice of the claim and grants Provider sole control over defense and settlement.

9. GOVERNING LAW AND VENUE
This Agreement shall be governed by the laws of the State of New York, without regard to conflict of laws principles. The state and federal courts located in New York County, New York shall have exclusive jurisdiction over any disputes arising hereunder.

CLOUDPULSE SYSTEMS INC.       APEX GLOBAL LOGISTICS CORP.
By: /s/ Sarah Jenkins         By: /s/ Robert Sterling
Name: Sarah Jenkins           Name: Robert Sterling
Title: VP of Sales            Title: Chief Information Officer`,
  },
  {
    id: "sample-employment",
    name: "Executive_Employment_Agreement_BioSync.txt",
    type: "Employment & Proprietary Rights Agreement",
    description: "Executive employment contract featuring compensation, at-will termination, restrictive covenants, IP assignment, and severance conditions.",
    pageCount: 3,
    text: `EXECUTIVE EMPLOYMENT AND INVENTIONS ASSIGNMENT AGREEMENT

This Employment Agreement is entered into on August 10, 2026, by and between:
EMPLOYER: BioSync Therapeutics Inc., a Delaware corporation located in Boston, Massachusetts ("Company"), and
EMPLOYEE: Dr. Julian Vance, residing in Cambridge, Massachusetts ("Executive").

1. POSITION AND DUTIES
The Company agrees to employ Executive in the position of Chief Technology Officer (CTO). Executive will report to the Chief Executive Officer and Board of Directors, devoting full business time, attention, and effort to the business affairs of the Company.

2. COMPENSATION AND BENEFITS
2.1 Base Salary: The Company shall pay Executive an initial annual base salary of $240,000 USD, payable in bi-weekly installments in accordance with regular payroll procedures.
2.2 Discretionary Annual Bonus: Executive will be eligible to participate in the Company's annual performance bonus program, with an annualized target bonus of 25% of Base Salary, subject to achievement of milestones determined by the Board.
2.3 Equity Incentive: Executive shall receive an option grant to purchase 120,000 shares of Common Stock, vesting over four (4) years: 25% after twelve (12) months (1-year cliff), with remaining shares vesting in equal monthly increments over the subsequent 36 months.

3. AT-WILL EMPLOYMENT AND TERMINATION
3.1 At-Will Relationship: Executive's employment is at-will. Either Executive or the Company may terminate employment at any time, with or without cause, upon thirty (30) days prior written notice.
3.2 Severance upon Involuntary Termination Without Cause: If the Company terminates Executive's employment without Cause (as defined herein), and subject to Executive executing an effective release of claims within forty-five (45) days, the Company shall pay severance equal to six (6) months of Base Salary plus reimbursement of COBRA healthcare premiums for six (6) months.

4. INTELLECTUAL PROPERTY AND INVENTIONS ASSIGNMENT
Executive agrees that all inventions, discoveries, software code, biotechnology protocols, and improvements made or conceived by Executive during employment that relate to the Company's business shall be the sole and exclusive property of the Company ("Work for Hire"). Executive hereby irrevocably assigns all rights, titles, and interests in such inventions to BioSync Therapeutics Inc.

5. RESTRICTIVE COVENANTS
5.1 Non-Solicitation: During employment and for a period of twelve (12) months following termination, Executive shall not directly or indirectly solicit, induce, or encourage any employee or independent contractor of the Company to leave their employment.
5.2 Non-Competition: For twelve (12) months following termination, Executive agrees not to provide executive or advisory services to any direct competitor developing gene editing therapies within a 50-mile radius of Boston, MA. (NOTE: Subject to statutory enforceability standards under Massachusetts Noncompetition Agreement Act).
5.3 Confidentiality: Executive shall maintain complete confidentiality regarding all proprietary research, clinical trials, formulas, and donor records indefinitely.

6. GOVERNING LAW AND SEVERABILITY
This Agreement shall be governed by the laws of the Commonwealth of Massachusetts. If any provision is deemed unenforceable, the remaining provisions shall continue in full force and effect.

BIOSYNC THERAPEUTICS INC.     EXECUTIVE
By: /s/ Dr. Amanda Cross       By: /s/ Dr. Julian Vance
Title: Chief Executive Officer Dr. Julian Vance`,
  },
  {
    id: "sample-lease",
    name: "Commercial_Real_Estate_Lease_Summit_Plaza.txt",
    type: "Commercial Property Lease",
    description: "Triple-net commercial real estate lease with base rent, security deposit, tenant improvements, late charges, and holdover provisions.",
    pageCount: 4,
    text: `COMMERCIAL REAL ESTATE LEASE AGREEMENT

This Commercial Lease Agreement (the "Lease") is made on July 1, 2026, by and between:
LANDLORD: Summit Commercial Holdings LLC, an Illinois limited liability company ("Landlord"), and
TENANT: Meridian Specialty Coffee LLC, an Illinois limited liability company ("Tenant").

1. PREMISES AND TERM
Landlord hereby leases to Tenant Suite 104, consisting of approximately 2,400 rentable square feet located at Summit Plaza, 1420 N. Michigan Avenue, Chicago, Illinois (the "Premises").
The Term of this Lease shall be thirty-six (36) months, commencing on September 1, 2026 (the "Commencement Date") and expiring on August 31, 2029.

2. RENT AND SECURITY DEPOSIT
2.1 Base Rent: Tenant shall pay Landlord Monthly Base Rent of $7,200.00 USD, payable in advance on the first (1st) day of each calendar month.
2.2 Additional Rent (Triple Net / NNN): Tenant shall pay its proportionate share (8.5%) of building operating expenses, property taxes, and building insurance, estimated at $1,450.00 USD per month.
2.3 Security Deposit: Concurrently with execution, Tenant deposits $14,400.00 USD (equivalent to two months' base rent) as security for faithful performance.
2.4 Late Fee: If any monthly rent payment is not received within five (5) business days after the due date, Tenant shall pay a late charge equal to 5% of the overdue balance.

3. USE AND TENANT IMPROVEMENTS
The Premises shall be used solely for the retail sale of specialty coffee, beverages, and baked goods. Tenant shall not perform any structural alterations without Landlord's prior written consent. All permanent fixtures installed by Tenant shall become property of Landlord upon lease expiration.

4. MAINTENANCE, REPAIRS, AND UTILITIES
Tenant shall maintain the interior of the Premises, HVAC systems servicing the suite, plumbing fixtures, and glass storefront in good repair. Landlord shall maintain the roof, foundation, and exterior structural walls. Tenant shall be responsible for all utilities, including electricity, water, and gas.

5. INDEMNIFICATION AND INSURANCE
Tenant shall indemnify, defend, and hold harmless Landlord against any third-party claims arising from accidents or injuries within the Premises. Tenant shall maintain Commercial General Liability insurance with coverage of at least $2,000,000 per occurrence and name Landlord as an additional insured.

6. DEFAULT AND REMEDIES
If Tenant fails to pay rent within ten (10) days after written notice of delinquency, or fails to cure any non-monetary default within thirty (30) days, Landlord may terminate this Lease, re-enter the Premises, and accelerate remaining rent due under the term.

7. HOLDOVER TENANCY
If Tenant remains in possession of the Premises after expiration of the Term without Landlord's written consent, Tenant shall be deemed a tenant at sufferance and shall pay Monthly Rent equal to two hundred percent (200%) of the Base Rent in effect during the last month of the Term.

8. GOVERNING LAW
This Lease shall be governed by the laws of the State of Illinois. Jurisdiction shall lie exclusively in Cook County, Illinois.

SUMMIT COMMERCIAL HOLDINGS LLC    MERIDIAN SPECIALTY COFFEE LLC
By: /s/ Arthur Vance              By: /s/ Clara Morales
Title: Managing Partner           Title: Operating Member`,
  },
];
