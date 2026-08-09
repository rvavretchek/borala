# Máquinas de estado do MVP

Este companion é parte normativa da [SPEC](./SPEC.md).

## Jornada principal

```mermaid
flowchart TD
    A[Criar rolê] --> B{Como começa?}
    B -->|Primeiro, quem topa| C[Coletar interesse geral]
    B -->|Já tenho um local| D[Criar opção inicial]
    C --> E[Organização]
    D --> E
    E --> F[Opções ativas e inativas]
    F --> G[Respostas por opção]
    G --> H{Declaração do grupo}
    H -->|Vai ter rolê| I[Realização declarada<br/>local ainda aberto]
    H -->|Local definido| J[Rolê definido]
    I --> F
    F --> J
    J --> K[Rolê em andamento]
    J --> L[Cancelado]
    K --> L
    K --> M[Encerrado]
```

## Estados do rolê

```mermaid
stateDiagram-v2
    [*] --> Organizing
    Organizing --> OccurrenceDeclared: declarar Vai ter rolê
    Organizing --> Defined: declarar local
    Organizing --> Cancelled: cancelar
    OccurrenceDeclared --> Defined: declarar local
    OccurrenceDeclared --> Cancelled: cancelar
    Defined --> InProgress: alcançar horário aproximado
    Defined --> Cancelled: cancelar
    InProgress --> Cancelled: cancelar em emergência
    InProgress --> Ended: alcançar limite final
    Cancelled --> [*]
    Ended --> [*]
```

`Cancelled` é terminal. Não existe restauração no MVP.

## Estado de uma opção

```mermaid
stateDiagram-v2
    [*] --> Active: sugerir local
    Active --> Inactive: inativar opção
    Inactive --> Active: reativar opção
    Active --> Closed: rolê definido
    Inactive --> Closed: rolê definido
    Closed --> [*]
```

`Closed` preserva dados, respostas e histórico, mas não aceita novas ações sobre a opção.

## Correção e outro rolê

```mermaid
flowchart LR
    A[Declaração registrada] --> B{O registro estava errado?}
    B -->|Sim| C[Corrigir declaração<br/>mesmo rolê]
    B -->|Não, o grupo mudou| D[Criar outro rolê<br/>novo local ou data]
    C --> E[Histórico preservado]
    D --> F[Respostas começam vazias]
```

## Concorrência de declarações

```mermaid
sequenceDiagram
    participant Ana
    participant BL as Bora Lá
    participant Bruno
    Ana->>BL: Declara X-Bar
    Bruno->>BL: Declara Bar Y sobre a mesma versão
    BL-->>Bruno: Informa conflito; X-Bar permanece vigente
    BL-->>Ana: Notifica divergência registrada
    Note over Ana,Bruno: O grupo discute no canal externo
    Bruno->>BL: Corrige declaração para Bar Y
    BL-->>Ana: Histórico mostra declaração e correção
```
