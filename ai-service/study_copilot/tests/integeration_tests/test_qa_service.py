from study_copilot.app.services.qa_service import QAService, QARequest
qa_service = QAService()
test_request = QARequest(question="According to the guide, what are the three types of datasets that processed data is broken into?")
print(qa_service.answer_question(test_request))