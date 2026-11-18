describe('página inicial', () => {
  beforeEach(() => {
    cy.viewport(320, 800);
    cy.visit('/', {
      onBeforeLoad(window) {
        cy.spy(window.console, 'error').as('consoleError');
      },
    });
    cy.injectAxe();
  });

  it('é compreensível sem JavaScript do cliente e não possui violações detectáveis', () => {
    cy.get('html').should('have.attr', 'lang', 'pt-BR');
    cy.get('main').should('contain.text', 'Bora Lá');
    cy.get('@consoleError').should('not.have.been.called');
    cy.checkA11y();
  });

  it('entrega conteúdo essencial e segurança no HTML bruto', () => {
    cy.request('/').then((firstResponse) => {
      expect(firstResponse.status).to.equal(200);
      expect(firstResponse.body).to.include('lang="pt-BR"');
      expect(firstResponse.body).to.include('organizar um rolê');

      const policy = firstResponse.headers['content-security-policy'];
      expect(policy).to.be.a('string');
      const nonce = String(policy).match(/'nonce-([^']+)'/)?.[1];
      expect(nonce).to.be.a('string');
      expect(nonce?.length).to.be.greaterThan(0);
      const scripts =
        String(firstResponse.body).match(/<script\b[^>]*>/g) ?? [];
      for (const script of scripts) {
        expect(script).to.include(`nonce="${nonce}"`);
      }
      expect(scripts).to.have.length(0);
      expect(firstResponse.headers['x-content-type-options']).to.equal(
        'nosniff',
      );
      expect(firstResponse.headers['referrer-policy']).to.equal('no-referrer');
      expect(firstResponse.headers['permissions-policy']).to.equal(
        'camera=(), microphone=(), geolocation=()',
      );

      cy.request('/').then((secondResponse) => {
        expect(secondResponse.headers['content-security-policy']).not.to.equal(
          policy,
        );
      });
    });

    cy.request({ url: '/nao-existe', failOnStatusCode: false }).then(
      (response) => {
        expect(response.status).to.equal(404);
        expect(response.headers['content-security-policy']).to.contain(
          "frame-ancestors 'none'",
        );
        expect(response.body).to.include('Página não encontrada');
      },
    );
  });

  it('reflui a 400% de zoom sem perda de conteúdo ou rolagem horizontal', () => {
    cy.document().then((document) => {
      document.documentElement.style.zoom = '4';
    });

    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.be.at.most(
        document.documentElement.clientWidth,
      );
    });
    cy.get('.purpose').should('exist');
    cy.get('.brand-signature img').should('exist');
  });

  it('reflui com espaçamento de texto ampliado sem rolagem horizontal', () => {
    cy.document().then((document) => {
      const style = document.createElement('style');
      style.textContent = `
        * { line-height: 1.5 !important; letter-spacing: .12em !important;
            word-spacing: .16em !important; }
        p { margin-bottom: 2em !important; }
      `;
      document.head.append(style);
      const purpose = document.querySelector('.purpose');
      purpose?.append(
        ' Esta é uma sequência deliberadamente longa para verificar a quebra de texto sem perda de conteúdo.',
      );
    });

    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.be.at.most(
        document.documentElement.clientWidth,
      );
    });
  });
});
