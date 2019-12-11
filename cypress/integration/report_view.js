import custom_submittable_doctype from '../fixtures/custom_submittable_doctype';
const doctype_name = custom_submittable_doctype.name;

context('Report View', () => {
	before(() => {
		cy.login();
		cy.visit('/desk');
		cy.insert_doc('DocType', custom_submittable_doctype, true);
		cy.insert_doc(doctype_name, {
			'title': 'Doc 1',
			'description': 'Random Text',
			'enabled': 0,
			// submit document
			'docstatus': 1
		}, true);

	});
	it('Field with enabled allow_on_submit should be editable.', () => {
		cy.server();
		cy.route('POST', 'api/method/frappe.client.set_value').as('value-update');
		cy.visit(`/desk#List/${doctype_name}/Report`);
		let cell = cy.get('.dt-row-0 > .dt-cell--col-3');
		// select the cell
		cell.dblclick();
		cell.find('input[data-fieldname="enabled"]').check({force: true});
		cy.get('.dt-row-0 > .dt-cell--col-4').click();
		cy.wait('@value-update');
	});
});