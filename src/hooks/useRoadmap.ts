import { TOOL_BAR_COMPONENT_ITEMS } from "../utils/constants/roadmap";

export const useRoadmap = () => {
  const getElementsByPropertyAndValue = (property: string, value: string) => {
    let elements = document.getElementsByTagName('*');
    let matchingElements = [];

    for (let i = 0; i < elements.length; i++) {
      if (elements[i].hasAttribute(property) && elements[i].getAttribute(property) === value) {
        matchingElements.push(elements[i]);
      }
    }

    return matchingElements;
  };

  const newSemesterTargetItem = () => ({
    id: new Date().getTime().toString(),
    iconName: 'MdCheckCircleOutline',
    iconColor: '#000000',
    label: 'Target label',
  });

  const newLegendItem = () => ({
    id: new Date().getTime().toString(),
    iconName: 'MdCheckCircleOutline',
    iconColor: '#000000',
    label: 'Legend label',
  });
  const newLinkItem = () => ({ id: new Date().getTime().toString(), typeId: 'artice', title: 'Title', url: '' });

  const newFAQItem = () => ({ id: new Date().getTime().toString(), question: '', answer: '' });

  const newTag = (value = 'newTag') => ({ id: new Date().getTime().toString(), label: value });

  const newQuestionChoiceItem = () => ({ id: new Date().getTime().toString(), title: 'Option title' });

  const newQuestPoolItem = () => ({
    id: new Date().getTime().toString(),
    order: 0,
    typeId: 'questionPoolChoice',
    question: '',
    choiceOptions: [newQuestionChoiceItem()],
    choiceAnswers: [] as any[],
    doesItHaveOtherOption: false,
    isItMultipleChoice: false,
    hint: '',
    isItRequired: false,
  });

  const componentDefaultSize = (type: string) => {
    switch (type) {
      case TOOL_BAR_COMPONENT_ITEMS.TITLE: {
        return { width: 150, height: 60 };
      }
      // case 'topic': { return { width: 150, height: 60 }; }
      case TOOL_BAR_COMPONENT_ITEMS.SEMESTER: {
        return { width: 300, height: 60 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.SUBJECT: {
        return { width: 300, height: 60 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.STUDY_TOPIC: {
        return { width: 300, height: 60 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.BUTTON: {
        return { width: 144, height: 57 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.LEGEND: {
        return { width: 300, height: 93 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.PARAGRAPH: {
        return { width: 300, height: 300 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.LINKS_GROUP: {
        return { width: 300, height: 93 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.HORIZONTAL_LINE: {
        return { width: 600, height: 30 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.VERTICAL_LINE: {
        return { width: 30, height: 600 };
      }
      case TOOL_BAR_COMPONENT_ITEMS.GROUP_SELECTION: {
        return { width: 400, height: 300 };
      }
      default: {
        return { width: 0, height: 0 };
      }
    }
  };

  const getEditorBarHeight = () => {
    const FlowEditor = document.getElementById('FlowEditor');
    return FlowEditor?.offsetHeight ? `${FlowEditor.offsetHeight}px` : '300px';
  };

  const getElementByDataId = (id: string) => {
    const element = document.querySelectorAll(`[data-id='${id}']`);
    if (element.length && element.length > 0) return element[0] as HTMLElement;
    else return null;
  };

  return {
    newSemesterTargetItem,
    newLegendItem,
    newLinkItem,
    newFAQItem,
    newTag,
    newQuestionChoiceItem,
    newQuestPoolItem,
    getElementsByPropertyAndValue,
    componentDefaultSize,
    getEditorBarHeight,
    getElementByDataId
  };
};